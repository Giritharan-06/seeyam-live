<?php
/*
Plugin Name: Seeyam Headless CMS Integration
Description: Custom post types, Lead & CRM Management, SEO & Analytics, REST API endpoints, Appearance & Fonts settings, and meta fields for the Seeyam Technologies Next.js Headless Platform.
Version: 2.0.0
Author: Seeyam Technologies
*/

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('Seeyam_Headless_CMS')) {

class Seeyam_Headless_CMS {

    const CACHE_KEY  = 'seeyam_platform_data_v2';
    const CACHE_TTL  = 30; // seconds — matches Next.js ISR revalidation window
    const LEAD_STATUSES = ['NEW', 'CONTACTED', 'COUNSELING', 'ENROLLED', 'DROPPED'];

    public function __construct() {
        add_action('init',                [$this, 'register_post_types']);
        add_action('init',                [$this, 'register_taxonomies']);
        add_action('init',                [$this, 'register_meta_fields']);
        add_action('init',                [$this, 'maybe_auto_seed_initial_data'], 20);
        add_action('rest_api_init',       [$this, 'register_rest_routes']);
        add_action('rest_api_init',       [$this, 'register_cors_handler'], 15);
        add_action('admin_menu',          [$this, 'register_admin_menu']);
        add_action('admin_init',          [$this, 'register_settings']);
        add_action('admin_bar_menu',      [$this, 'add_admin_bar_quick_links'], 100);
        add_action('admin_post_seeyam_seed_data', [$this, 'handle_manual_seed']);
        add_action('add_meta_boxes',      [$this, 'register_meta_boxes'], 10, 2);
        add_action('save_post',           [$this, 'save_meta_boxes_data']);
        add_action('save_post',           [$this, 'clear_platform_cache'], 20);
        add_action('save_post',           [$this, 'dispatch_frontend_revalidation'], 25, 2);
        add_action('deleted_post',        [$this, 'dispatch_frontend_revalidation'], 25, 2);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_action('updated_option',      [$this, 'maybe_clear_cache_on_option_update'], 10, 3);

        add_filter('manage_lead_posts_columns',          [$this, 'set_lead_columns']);
        add_action('manage_lead_posts_custom_column',    [$this, 'render_lead_columns'], 10, 2);
        add_filter('views_edit-lead',                    [$this, 'add_lead_status_views']);
        add_action('pre_get_posts',                      [$this, 'filter_leads_by_status']);

        add_filter('page_link',                          [$this, 'filter_headless_page_permalink'], 10, 2);
        add_filter('post_type_link',                     [$this, 'filter_headless_cpt_permalink'], 10, 2);
        add_filter('preview_post_link',                  [$this, 'filter_headless_preview_permalink'], 10, 2);
    }

    /* -------------------------------------------------------------------------
     * CACHE & ON-DEMAND REVALIDATION (WEBHOOK)
     * ---------------------------------------------------------------------- */

    public function clear_platform_cache($post_id = null) {
        if ($post_id) {
            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
            $relevant = ['course', 'branch', 'placement', 'review', 'batch', 'lead'];
            if (!in_array(get_post_type($post_id), $relevant, true)) return;
        }
        delete_transient(self::CACHE_KEY);
    }

    public function dispatch_frontend_revalidation($post_id = null, $post = null) {
        if ($post_id) {
            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
            if (wp_is_post_revision($post_id)) return;
        }

        $options     = get_option('seeyam_site_options', []);
        $webhook_url = !empty($options['frontend_webhook_url'])
            ? esc_url_raw($options['frontend_webhook_url'])
            : 'http://localhost:3000/api/revalidate';
        $secret      = !empty($options['webhook_secret'])
            ? $options['webhook_secret']
            : (!empty($options['api_key']) ? $options['api_key'] : '');

        $post_obj  = $post ? $post : ($post_id ? get_post($post_id) : null);
        $post_type = $post_obj ? $post_obj->post_type : 'settings';
        $slug      = $post_obj ? $post_obj->post_name : '';

        // Ignore internal WP types
        $ignored = ['revision', 'nav_menu_item', 'custom_css', 'customize_changeset', 'oembed_cache'];
        if (in_array($post_type, $ignored, true)) return;

        $payload = [
            'post_id'   => $post_id,
            'post_type' => $post_type,
            'slug'      => $slug,
            'action'    => 'save_post',
            'timestamp' => current_time('c'),
        ];

        // Non-blocking fast HTTP post to Next.js webhook
        wp_remote_post($webhook_url, [
            'method'    => 'POST',
            'timeout'   => 5,
            'blocking'  => false,
            'headers'   => [
                'Content-Type'        => 'application/json',
                'x-revalidate-secret' => $secret,
            ],
            'body'      => wp_json_encode($payload),
            'sslverify' => false,
        ]);
    }

    public function maybe_clear_cache_on_option_update($option_name, $old_value = null, $new_value = null) {
        if ($option_name === 'seeyam_site_options') {
            delete_transient(self::CACHE_KEY);
            $this->dispatch_frontend_revalidation(null);
        }
    }

    /* -------------------------------------------------------------------------
     * CORS — Dynamic origin + OPTIONS preflight
     * ---------------------------------------------------------------------- */

    public function register_cors_handler() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', [$this, 'send_seeyam_cors_headers'], 1, 4);
    }

    public function send_seeyam_cors_headers($served, $result, $request, $server) {
        // Only apply to our namespace
        $route = $request->get_route();
        if (strpos($route, '/seeyam/v1') !== 0 && strpos($route, '/wp/v2') !== 0) {
            // Still send basic WP CORS for other routes
            rest_send_cors_headers($request);
            return $served;
        }

        $options = get_option('seeyam_site_options', []);
        $allowed_origin = !empty($options['cors_allowed_origin'])
            ? esc_url_raw($options['cors_allowed_origin'])
            : '*';

        header("Access-Control-Allow-Origin: {$allowed_origin}");
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, X-WP-Nonce, X-Seeyam-Key, Authorization');
        header('Vary: Origin');

        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            header('Access-Control-Max-Age: 86400');
            status_header(204);
            exit;
        }

        return $served;
    }

    /* -------------------------------------------------------------------------
     * API KEY AUTH — X-Seeyam-Key header with current_user_can() fallback
     * ---------------------------------------------------------------------- */

    private function check_api_auth($request) {
        $options    = get_option('seeyam_site_options', []);
        $stored_key = $options['api_key'] ?? '';
        $given_key  = $request->get_header('X-Seeyam-Key');

        if ($stored_key && $given_key && hash_equals($stored_key, $given_key)) {
            return true;
        }
        if (current_user_can('edit_posts')) {
            return true;
        }
        return new WP_Error('unauthorized', 'Valid X-Seeyam-Key header or an authenticated WordPress session is required.', ['status' => 401]);
    }

    /* -------------------------------------------------------------------------
     * 1. CUSTOM POST TYPES
     * ---------------------------------------------------------------------- */

    public function register_post_types() {
        register_post_type('course', [
            'labels'       => ['name' => 'Courses', 'singular_name' => 'Course', 'add_new_item' => 'Add New Course', 'edit_item' => 'Edit Course Program'],
            'public'       => true, 'has_archive' => true, 'show_in_rest' => true,
            'rest_base'    => 'courses',
            'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
            'menu_icon'    => 'dashicons-welcome-learn-more',
        ]);

        register_post_type('branch', [
            'labels'    => ['name' => 'Branches / Campuses', 'singular_name' => 'Branch', 'add_new_item' => 'Add New Branch', 'edit_item' => 'Edit Branch'],
            'public'    => true, 'has_archive' => true, 'show_in_rest' => true,
            'rest_base' => 'branches',
            'supports'  => ['title', 'editor', 'thumbnail', 'custom-fields'],
            'menu_icon' => 'dashicons-location-alt',
        ]);

        register_post_type('lead', [
            'labels'       => ['name' => 'Student Leads & CRM', 'singular_name' => 'Lead Inquiry', 'add_new_item' => 'Add New Walk-in / Lead', 'edit_item' => 'Edit Student Lead & Notes'],
            'public'       => false, 'show_ui' => true, 'show_in_menu' => true,
            'show_in_rest' => true, 'rest_base' => 'leads',
            'supports'     => ['title', 'custom-fields'],
            'menu_icon'    => 'dashicons-groups',
        ]);

        register_post_type('placement', [
            'labels'    => ['name' => 'Placements & Alumni', 'singular_name' => 'Placement Story', 'add_new_item' => 'Add New Placement Story', 'edit_item' => 'Edit Placement Story'],
            'public'    => true, 'has_archive' => true, 'show_in_rest' => true,
            'rest_base' => 'placements',
            'supports'  => ['title', 'editor', 'thumbnail', 'custom-fields'],
            'menu_icon' => 'dashicons-awards',
        ]);

        register_post_type('review', [
            'labels'    => ['name' => 'Student Reviews', 'singular_name' => 'Review', 'add_new_item' => 'Add New Review', 'edit_item' => 'Edit Review'],
            'public'    => true, 'has_archive' => true, 'show_in_rest' => true,
            'rest_base' => 'reviews',
            'supports'  => ['title', 'editor', 'custom-fields'],
            'menu_icon' => 'dashicons-star-filled',
        ]);

        register_post_type('batch', [
            'labels'    => ['name' => 'Upcoming Batches', 'singular_name' => 'Batch', 'add_new_item' => 'Add New Batch', 'edit_item' => 'Edit Batch'],
            'public'    => true, 'has_archive' => true, 'show_in_rest' => true,
            'rest_base' => 'batches',
            'supports'  => ['title', 'custom-fields'],
            'menu_icon' => 'dashicons-calendar-alt',
        ]);

        register_post_type('seeyam_faq', [
            'labels'    => ['name' => 'FAQs', 'singular_name' => 'FAQ', 'add_new_item' => 'Add New FAQ', 'edit_item' => 'Edit FAQ'],
            'public'    => true, 'has_archive' => false, 'show_in_rest' => true,
            'rest_base' => 'faqs',
            'supports'  => ['title', 'editor', 'custom-fields', 'page-attributes'],
            'menu_icon' => 'dashicons-editor-help',
        ]);

        register_post_type('seeyam_interview_question', [
            'labels'    => ['name' => 'Interview Questions', 'singular_name' => 'Interview Question', 'add_new_item' => 'Add New Question', 'edit_item' => 'Edit Interview Question'],
            'public'    => true, 'has_archive' => false, 'show_in_rest' => true,
            'rest_base' => 'interview_questions',
            'supports'  => ['title', 'editor', 'custom-fields', 'page-attributes'],
            'menu_icon' => 'dashicons-format-chat',
        ]);

        register_post_type('seeyam_resource', [
            'labels'    => ['name' => 'Downloadable Resources', 'singular_name' => 'Resource', 'add_new_item' => 'Add New Resource', 'edit_item' => 'Edit Resource'],
            'public'    => true, 'has_archive' => false, 'show_in_rest' => true,
            'rest_base' => 'resources',
            'supports'  => ['title', 'editor', 'thumbnail', 'custom-fields', 'page-attributes'],
            'menu_icon' => 'dashicons-download',
        ]);

        register_post_type('seeyam_job_portal_link', [
            'labels'    => ['name' => 'Job Portal Links', 'singular_name' => 'Job Portal Link', 'add_new_item' => 'Add New Portal Link', 'edit_item' => 'Edit Job Portal Link'],
            'public'    => true, 'has_archive' => false, 'show_in_rest' => true,
            'rest_base' => 'job_portal_links',
            'supports'  => ['title', 'custom-fields', 'page-attributes'],
            'menu_icon' => 'dashicons-external',
        ]);
    }

    /* -------------------------------------------------------------------------
     * 2. TAXONOMIES
     * ---------------------------------------------------------------------- */

    public function register_taxonomies() {
        register_taxonomy('course_category', ['course'], [
            'labels'           => ['name' => 'Course Categories', 'singular_name' => 'Course Category', 'add_new_item' => 'Add New Category'],
            'hierarchical'     => true, 'public' => true,
            'show_in_rest'     => true, 'rest_base' => 'course_categories',
            'show_admin_column'=> true,
        ]);
    }

    /* -------------------------------------------------------------------------
     * 3. META FIELDS
     * ---------------------------------------------------------------------- */

    public function register_meta_fields() {
        $meta_definitions = [
            'course'                    => ['category_id' => 'string', 'summary' => 'string', 'duration' => 'string', 'mode' => 'string', 'price' => 'number', 'starting_price' => 'number', 'brochure_pdf_url' => 'string', 'expected_salary' => 'string', 'rating' => 'number', 'enrolled_count' => 'number', 'is_featured' => 'boolean', 'highlights' => 'string', 'syllabus' => 'string', 'hiring_partners' => 'string', 'seo_title' => 'string', 'seo_description' => 'string', 'seo_keywords' => 'string'],
            'branch'                    => ['address' => 'string', 'city' => 'string', 'phone' => 'string', 'whatsapp' => 'string', 'email' => 'string', 'timing' => 'string', 'landmark' => 'string', 'map_embed_url' => 'string', 'seo_title' => 'string', 'seo_description' => 'string'],
            'lead'                      => ['student_name' => 'string', 'student_email' => 'string', 'student_phone' => 'string', 'course_id' => 'string', 'branch_id' => 'string', 'lead_status' => 'string', 'source' => 'string', 'notes_json' => 'string'],
            'placement'                 => ['student_name' => 'string', 'company_name' => 'string', 'role' => 'string', 'package_ctc' => 'string', 'student_avatar_url' => 'string', 'course_id' => 'string', 'branch_id' => 'string', 'quote' => 'string'],
            'review'                    => ['student_name' => 'string', 'student_email' => 'string', 'course_id' => 'string', 'branch_id' => 'string', 'rating' => 'number', 'review_title' => 'string', 'completion_year' => 'string', 'review_status' => 'string'],
            'batch'                     => ['course_id' => 'string', 'branch_id' => 'string', 'instructor_name' => 'string', 'instructor_exp' => 'string', 'start_date' => 'string', 'timing' => 'string', 'max_seats' => 'number', 'seats_left' => 'number', 'batch_status' => 'string'],
            'seeyam_faq'                => ['course_id' => 'string', 'faq_category' => 'string', 'order_num' => 'number'],
            'seeyam_interview_question' => ['course_id' => 'string', 'category' => 'string', 'order_num' => 'number', 'answer' => 'string'],
            'seeyam_resource'           => ['resource_type' => 'string', 'file_url' => 'string', 'course_id' => 'string', 'file_size' => 'string', 'category' => 'string'],
            'seeyam_job_portal_link'    => ['site_name' => 'string', 'url' => 'string', 'role_filter' => 'string', 'badge' => 'string', 'order_num' => 'number'],
        ];

        foreach ($meta_definitions as $post_type => $fields) {
            foreach ($fields as $field => $type) {
                register_post_meta($post_type, $field, [
                    'show_in_rest' => true, 'single' => true, 'type' => $type,
                    'auth_callback' => function() { return current_user_can('edit_posts'); },
                ]);
            }
        }
    }

    public function maybe_auto_seed_initial_data() {
        $count   = wp_count_posts('course');
        $b_count = wp_count_posts('batch');
        $p_count = wp_count_posts('page');
        $publish_pages = isset($p_count->publish) ? (int)$p_count->publish : 0;
        if (empty($count) || !isset($count->publish) || (int)$count->publish === 0 || 
            empty($b_count) || !isset($b_count->publish) || (int)$b_count->publish === 0 ||
            $publish_pages < 8) {
            $this->seed_all_content();
        }
    }

    public function filter_headless_page_permalink($link, $post_id) {
        $post = get_post($post_id);
        if (!$post) return $link;
        $frontend_url = 'http://localhost:3000';
        $slug_map = [
            'home'        => '/',
            'homepage'    => '/',
            'courses'     => '/courses',
            'branches'    => '/branches',
            'campuses'    => '/branches',
            'placements'  => '/placements',
            'reviews'     => '/reviews',
            'about'       => '/about',
            'about-us'    => '/about',
            'contact'     => '/contact',
            'contact-us'  => '/contact',
        ];
        if (isset($slug_map[$post->post_name])) {
            return $frontend_url . $slug_map[$post->post_name];
        }
        return $frontend_url . '/' . $post->post_name;
    }

    public function filter_headless_cpt_permalink($link, $post) {
        if (!$post) return $link;
        $frontend_url = 'http://localhost:3000';
        if (is_object($post) && isset($post->post_type)) {
            if ($post->post_type === 'course') {
                return $frontend_url . '/courses/' . $post->post_name;
            }
            if ($post->post_type === 'branch') {
                return $frontend_url . '/branches/' . $post->post_name;
            }
        }
        return $link;
    }

    public function filter_headless_preview_permalink($link, $post) {
        if (!$post) return $link;
        return $this->filter_headless_cpt_permalink($link, $post);
    }

    public function enqueue_admin_assets($hook) {
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');
        wp_enqueue_media();
    }

    /* -------------------------------------------------------------------------
     * 4. LEAD MANAGEMENT COLUMNS & FILTERS
     * ---------------------------------------------------------------------- */

    public function set_lead_columns($columns) {
        return [
            'cb'          => $columns['cb'],
            'title'       => 'Student Candidate',
            'lead_phone'  => 'Phone / WhatsApp',
            'lead_email'  => 'Email',
            'lead_course' => 'Interested Course',
            'lead_branch' => 'Campus Preference',
            'lead_status' => 'Lead Status',
            'lead_source' => 'Source',
            'date'        => 'Inquiry Date',
        ];
    }

    public function render_lead_columns($column, $post_id) {
        $phone     = get_post_meta($post_id, 'student_phone', true);
        $email     = get_post_meta($post_id, 'student_email', true);
        $course_id = get_post_meta($post_id, 'course_id', true);
        $branch_id = get_post_meta($post_id, 'branch_id', true);
        $status    = get_post_meta($post_id, 'lead_status', true) ?: 'NEW';
        $source    = get_post_meta($post_id, 'source', true) ?: 'Website';

        $status_styles = [
            'NEW'        => 'background:#dbeafe; color:#1e40af; border:1px solid #93c5fd;',
            'CONTACTED'  => 'background:#fef3c7; color:#92400e; border:1px solid #fcd34d;',
            'COUNSELING' => 'background:#e0e7ff; color:#3730a3; border:1px solid #c7d2fe;',
            'ENROLLED'   => 'background:#dcfce7; color:#166534; border:1px solid #86efac;',
            'DROPPED'    => 'background:#fee2e2; color:#991b1b; border:1px solid #fca5a5;',
        ];
        $style = $status_styles[$status] ?? 'background:#f1f5f9; color:#475569;';

        switch ($column) {
            case 'lead_phone':
                echo $phone ? '<strong><a href="tel:' . esc_attr($phone) . '">' . esc_html($phone) . '</a></strong>' : '<span style="color:#94a3b8;">—</span>';
                break;
            case 'lead_email':
                echo $email ? '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>' : '<span style="color:#94a3b8;">—</span>';
                break;
            case 'lead_course':
                echo '<code>' . esc_html(str_replace('course-', '', $course_id)) . '</code>';
                break;
            case 'lead_branch':
                echo '<code>' . esc_html(str_replace('branch-', '', $branch_id)) . '</code>';
                break;
            case 'lead_status':
                echo '<span style="display:inline-block; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700; ' . $style . '">' . esc_html($status) . '</span>';
                break;
            case 'lead_source':
                echo '<span style="font-size:11px; color:#64748b;">' . esc_html($source) . '</span>';
                break;
        }
    }

    public function add_lead_status_views($views) {
        $current_status = isset($_GET['lead_status']) ? sanitize_text_field($_GET['lead_status']) : '';
        foreach (self::LEAD_STATUSES as $st) {
            $query = new WP_Query(['post_type' => 'lead', 'meta_key' => 'lead_status', 'meta_value' => $st, 'posts_per_page' => -1, 'fields' => 'ids']);
            $count = $query->found_posts;
            $class = ($current_status === $st) ? 'current' : '';
            $views['status_' . strtolower($st)] = sprintf(
                '<a href="%s" class="%s">%s <span class="count">(%d)</span></a>',
                admin_url('edit.php?post_type=lead&lead_status=' . $st),
                $class,
                ucwords(strtolower($st)),
                $count
            );
        }
        return $views;
    }

    public function filter_leads_by_status($query) {
        global $pagenow;
        if (is_admin() && $pagenow === 'edit.php' && isset($_GET['post_type']) && $_GET['post_type'] === 'lead' && !empty($_GET['lead_status'])) {
            $query->set('meta_key', 'lead_status');
            $query->set('meta_value', sanitize_text_field($_GET['lead_status']));
        }
    }

    /* -------------------------------------------------------------------------
     * 5. META BOXES
     * ---------------------------------------------------------------------- */

    public function register_meta_boxes() {
        add_meta_box('seeyam_course_meta',    '⚡ Course Curriculum, Pricing & Options',        [$this, 'render_course_metabox'],    'course',                      'normal', 'high');
        add_meta_box('seeyam_lead_meta',      '📋 Student Inquiry & Counselor CRM Details',     [$this, 'render_lead_metabox'],      'lead',                        'normal', 'high');
        add_meta_box('seeyam_seo_meta',       '🔍 SEO Meta Tags & Search Snippet Override',     [$this, 'render_seo_metabox'],       ['course', 'branch', 'page'],  'normal', 'default');
        add_meta_box('seeyam_branch_meta',    '📍 Branch Location & Contact Details',           [$this, 'render_branch_metabox'],    'branch',                      'normal', 'high');
        add_meta_box('seeyam_placement_meta', '🏆 Placement Details & Company Info',            [$this, 'render_placement_metabox'], 'placement',                   'normal', 'high');
        add_meta_box('seeyam_review_meta',    '⭐ Review Details, Body & Rating',               [$this, 'render_review_metabox'],    'review',                      'normal', 'high');
        add_meta_box('seeyam_batch_meta',     '📅 Batch Schedule, Instructor & Seat Capacity',  [$this, 'render_batch_metabox'],     'batch',                       'normal', 'high');
    }

    public function render_lead_metabox($post) {
        wp_nonce_field('seeyam_save_meta', 'seeyam_meta_nonce');
        $student_name = get_post_meta($post->ID, 'student_name', true) ?: $post->post_title;
        $phone        = get_post_meta($post->ID, 'student_phone', true);
        $email        = get_post_meta($post->ID, 'student_email', true);
        $course_id    = get_post_meta($post->ID, 'course_id', true) ?: 'course-mern';
        $branch_id    = get_post_meta($post->ID, 'branch_id', true) ?: 'branch-omr';
        $status       = get_post_meta($post->ID, 'lead_status', true) ?: 'NEW';
        $source       = get_post_meta($post->ID, 'source', true) ?: 'Website Modal';
        $notes_raw    = get_post_meta($post->ID, 'notes_json', true);
        $notes        = is_string($notes_raw) ? (json_decode($notes_raw, true) ?: []) : ($notes_raw ?: []);

        $courses  = get_posts(['post_type' => 'course',  'posts_per_page' => -1, 'post_status' => 'publish']);
        $branches = get_posts(['post_type' => 'branch',  'posts_per_page' => -1, 'post_status' => 'publish']);

        $input_style  = 'width:100%; height:38px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;';
        $select_style = 'width:100%; height:38px; border-radius:6px; border:1px solid #cbd5e1; font-weight:700;';
        $label_style  = 'font-weight:700; display:block; margin-bottom:4px;';
        ?>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
                <label style="<?php echo $label_style; ?>">Student Candidate Name *</label>
                <input type="text" name="student_name" value="<?php echo esc_attr($student_name); ?>" style="<?php echo $input_style; ?>" />
            </div>
            <div>
                <label style="<?php echo $label_style; ?>">Phone / WhatsApp Number *</label>
                <input type="text" name="student_phone" value="<?php echo esc_attr($phone); ?>" style="<?php echo $input_style; ?>" placeholder="+91 98765 43210" />
            </div>
            <div>
                <label style="<?php echo $label_style; ?>">Email Address</label>
                <input type="email" name="student_email" value="<?php echo esc_attr($email); ?>" style="<?php echo $input_style; ?>" placeholder="student@gmail.com" />
            </div>
            <div>
                <label style="<?php echo $label_style; ?>">Lead Status</label>
                <select name="lead_status" style="<?php echo $select_style; ?>">
                    <option value="NEW"        <?php selected($status, 'NEW');        ?>>🔵 NEW (Uncontacted)</option>
                    <option value="CONTACTED"  <?php selected($status, 'CONTACTED');  ?>>🟡 CONTACTED (Call / WhatsApp Sent)</option>
                    <option value="COUNSELING" <?php selected($status, 'COUNSELING'); ?>>🟣 COUNSELING (Career Discussion)</option>
                    <option value="ENROLLED"   <?php selected($status, 'ENROLLED');   ?>>🟢 ENROLLED (Joined Batch)</option>
                    <option value="DROPPED"    <?php selected($status, 'DROPPED');    ?>>🔴 DROPPED / LOST</option>
                </select>
            </div>
            <div>
                <label style="<?php echo $label_style; ?>">Interested Course Program</label>
                <select name="course_id" style="<?php echo $select_style; ?>">
                    <?php foreach ($courses as $c): ?>
                        <option value="course-<?php echo esc_attr($c->post_name); ?>" <?php selected($course_id, 'course-' . $c->post_name); ?>><?php echo esc_html($c->post_title); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div>
                <label style="<?php echo $label_style; ?>">Preferred Campus Branch</label>
                <select name="branch_id" style="<?php echo $select_style; ?>">
                    <?php foreach ($branches as $b): ?>
                        <option value="branch-<?php echo esc_attr($b->post_name); ?>" <?php selected($branch_id, 'branch-' . $b->post_name); ?>><?php echo esc_html($b->post_title); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
        </div>
        <div>
            <label style="<?php echo $label_style; ?>">Inquiry Source</label>
            <input type="text" name="source" value="<?php echo esc_attr($source); ?>" style="<?php echo $input_style; ?>" placeholder="e.g. Website Hero CTA, Walk-in, Google Ads" />
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-top:16px;">
            <h4 style="margin-top:0; color:#1e293b;">📝 Counselor Follow-Up Notes & Timeline</h4>
            <div style="max-height:180px; overflow-y:auto; margin-bottom:12px; display:flex; flex-direction:column; gap:8px;">
                <?php if (empty($notes)): ?>
                    <p style="font-size:12px; color:#94a3b8; margin:0;">No follow-up notes logged yet.</p>
                <?php else: ?>
                    <?php foreach ($notes as $n): ?>
                        <div style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:8px 12px; font-size:12px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <strong style="color:#2563eb;"><?php echo esc_html($n['author'] ?? 'Counselor'); ?></strong>
                                <span style="color:#64748b; font-size:11px;"><?php echo esc_html($n['timestamp'] ?? ''); ?></span>
                            </div>
                            <div style="color:#334155;"><?php echo esc_html($n['text'] ?? ''); ?></div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
            <label style="font-weight:700; font-size:12px; display:block; margin-bottom:4px;">Add New Counselor Note:</label>
            <textarea name="new_counselor_note" rows="2" style="width:100%; border-radius:6px; border:1px solid #cbd5e1; padding:6px; font-size:12px;" placeholder="e.g. Discussed fee discount. Student scheduled for demo on Saturday 10 AM."></textarea>
            <input type="hidden" name="notes_json" value="<?php echo esc_attr(wp_json_encode($notes)); ?>" />
        </div>
        <?php
    }

    public function render_seo_metabox($post) {
        wp_nonce_field('seeyam_save_meta', 'seeyam_meta_nonce');
        $seo_title    = get_post_meta($post->ID, 'seo_title', true);
        $seo_desc     = get_post_meta($post->ID, 'seo_description', true);
        $seo_keywords = get_post_meta($post->ID, 'seo_keywords', true);
        ?>
        <table class="form-table">
            <tr>
                <th style="width:200px;"><label style="font-weight:700;">Custom SEO Title Tag</label></th>
                <td>
                    <input type="text" name="seo_title" value="<?php echo esc_attr($seo_title); ?>" class="large-text" placeholder="e.g. Master Full Stack Java Training in Chennai | 100% Placement" />
                    <p class="description">Leave blank to use post title + site title automatically.</p>
                </td>
            </tr>
            <tr>
                <th><label style="font-weight:700;">Meta Description</label></th>
                <td><textarea name="seo_description" rows="2" class="large-text" placeholder="Snippet shown on Google search results..."><?php echo esc_textarea($seo_desc); ?></textarea></td>
            </tr>
            <tr>
                <th><label style="font-weight:700;">Target Focus Keywords</label></th>
                <td><input type="text" name="seo_keywords" value="<?php echo esc_attr($seo_keywords); ?>" class="large-text" placeholder="e.g. java full stack training, software courses chennai, omr navalur" /></td>
            </tr>
        </table>
        <?php
    }

    public function render_course_metabox($post) {
        wp_nonce_field('seeyam_save_meta', 'seeyam_meta_nonce');
        $summary         = get_post_meta($post->ID, 'summary', true);
        $duration        = get_post_meta($post->ID, 'duration', true) ?: '4 Months / 120 Hours';
        $mode            = get_post_meta($post->ID, 'mode', true) ?: 'HYBRID';
        $price           = get_post_meta($post->ID, 'price', true) ?: '38000';
        $salary          = get_post_meta($post->ID, 'expected_salary', true) ?: '₹ 6.0 - 15.0 LPA';
        $rating          = get_post_meta($post->ID, 'rating', true) ?: '4.9';
        $enrolled        = get_post_meta($post->ID, 'enrolled_count', true) ?: '12000';
        $featured        = get_post_meta($post->ID, 'is_featured', true);
        $hiring_raw      = get_post_meta($post->ID, 'hiring_partners', true) ?: 'Amazon, Microsoft, Google, Zoho, TCS, Infosys, Cognizant, Capgemini, Wipro';
        $highlights_raw  = get_post_meta($post->ID, 'highlights', true);
        $syllabus_raw    = get_post_meta($post->ID, 'syllabus', true);

        $highlights = is_string($highlights_raw) ? (json_decode($highlights_raw, true) ?: array_filter(array_map('trim', explode("\n", $highlights_raw)))) : ($highlights_raw ?: []);
        $syllabus   = is_string($syllabus_raw)   ? (json_decode($syllabus_raw, true) ?: [])   : ($syllabus_raw ?: []);

        $input_s = 'width:100%; height:38px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;';
        ?>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
                <label style="font-weight:700; display:block; margin-bottom:4px;">Short Course Summary *</label>
                <textarea name="summary" rows="3" style="width:100%; border-radius:6px; border:1px solid #cbd5e1; padding:8px;"><?php echo esc_textarea($summary); ?></textarea>
            </div>
            <div>
                <label style="font-weight:700; display:block; margin-bottom:4px;">Expected Salary Package</label>
                <input type="text" name="expected_salary" value="<?php echo esc_attr($salary); ?>" style="<?php echo $input_s; ?>" placeholder="e.g. ₹ 6.0 - 16.0 LPA" />
                <div style="margin-top:10px; display:flex; gap:12px;">
                    <div style="flex:1;">
                        <label style="font-weight:700; display:block; margin-bottom:4px;">Course Fee (₹)</label>
                        <input type="number" name="price" value="<?php echo esc_attr($price); ?>" style="<?php echo $input_s; ?>" placeholder="38000" />
                    </div>
                    <div style="flex:1;">
                        <label style="font-weight:700; display:block; margin-bottom:4px;">Training Mode</label>
                        <select name="mode" style="<?php echo $input_s; ?>">
                            <option value="HYBRID"    <?php selected($mode, 'HYBRID'); ?>>HYBRID (Online + Class)</option>
                            <option value="CLASSROOM" <?php selected($mode, 'CLASSROOM'); ?>>CLASSROOM</option>
                            <option value="ONLINE"    <?php selected($mode, 'ONLINE'); ?>>ONLINE (Live Interactive)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
            <div>
                <label style="font-weight:700; display:block; margin-bottom:4px;">Course Duration</label>
                <input type="text" name="duration" value="<?php echo esc_attr($duration); ?>" style="<?php echo $input_s; ?>" placeholder="e.g. 4 Months / 120 Hours" />
            </div>
            <div>
                <label style="font-weight:700; display:block; margin-bottom:4px;">Rating & Enrolled Count</label>
                <div style="display:flex; gap:10px; align-items:center;">
                    <input type="number" step="0.01" min="1" max="5" name="rating" value="<?php echo esc_attr($rating); ?>" style="width:80px; height:38px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" />
                    <input type="number" name="enrolled_count" value="<?php echo esc_attr($enrolled); ?>" style="flex:1; height:38px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" placeholder="14200" />
                    <label style="display:flex; align-items:center; gap:6px; font-size:12px; font-weight:700; background:#f1f5f9; padding:0 10px; border-radius:6px; height:38px; white-space:nowrap;">
                        <input type="checkbox" name="is_featured" value="1" <?php checked($featured, 1); ?> /> Featured
                    </label>
                </div>
            </div>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
            <h4 style="margin:0 0 8px 0;">🏢 Hiring Partners</h4>
            <p style="font-size:12px; color:#64748b; margin:0 0 8px 0;">Comma-separated employer names: <code>Amazon, Microsoft, Google, Zoho, TCS, Infosys, Cognizant</code></p>
            <input type="text" name="hiring_partners" value="<?php echo esc_attr($hiring_raw); ?>" style="width:100%; height:38px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px;" />
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
            <h4 style="margin:0 0 8px 0;">📄 Brochure & Syllabus PDF Download URL</h4>
            <p style="font-size:12px; color:#64748b; margin:0 0 8px 0;">Media URL to the downloadable brochure or syllabus document:</p>
            <input type="text" name="brochure_pdf_url" value="<?php echo esc_attr(get_post_meta($post->ID, 'brochure_pdf_url', true)); ?>" style="width:100%; height:38px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px;" placeholder="e.g. /resources/brochures/seeyam-data-analytics-brochure.pdf" />
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
            <h4 style="margin:0 0 10px 0;">⭐ Key Program Highlights</h4>
            <div id="highlights-container" style="margin-bottom:8px;">
                <?php foreach ($highlights as $hl): ?>
                    <div style="display:flex; gap:8px; margin-bottom:6px;">
                        <input type="text" name="highlights_list[]" value="<?php echo esc_attr($hl); ?>" style="flex:1; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" oninput="syncHighlights();" />
                        <button type="button" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="this.parentElement.remove(); syncHighlights();">✕</button>
                    </div>
                <?php endforeach; ?>
            </div>
            <button type="button" class="button button-secondary" onclick="addHighlightRow();">+ Add Highlight Point</button>
            <textarea id="highlights_json" name="highlights" style="display:none;"><?php echo esc_textarea(is_array($highlights) ? wp_json_encode($highlights) : $highlights_raw); ?></textarea>
        </div>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4 style="margin:0;">📚 Syllabus Curriculum Modules</h4>
                <button type="button" class="button button-primary" onclick="addSyllabusModule();">+ Add Syllabus Module</button>
            </div>
            <div id="syllabus-modules-container">
                <?php foreach ($syllabus as $mod): ?>
                    <div class="seeyam-module-item" style="background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:12px; margin-bottom:10px;">
                        <div style="display:flex; gap:8px; margin-bottom:8px;">
                            <input type="text" class="mod-title" value="<?php echo esc_attr($mod['title'] ?? ''); ?>" style="flex:2; font-weight:700; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" placeholder="Module Title" oninput="syncSyllabus();" />
                            <input type="text" class="mod-duration" value="<?php echo esc_attr($mod['duration'] ?? ''); ?>" style="flex:1; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" placeholder="Duration e.g. 4 Weeks" oninput="syncSyllabus();" />
                            <button type="button" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="this.closest('.seeyam-module-item').remove(); syncSyllabus();">Delete</button>
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; color:#64748b; display:block; margin-bottom:2px;">Topics Covered (Comma separated):</label>
                            <textarea class="mod-topics" rows="2" style="width:100%; border-radius:6px; border:1px solid #e2e8f0; font-size:12px; padding:6px;" oninput="syncSyllabus();"><?php echo esc_textarea(isset($mod['topics']) && is_array($mod['topics']) ? implode(', ', $mod['topics']) : ''); ?></textarea>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <textarea id="syllabus_json" name="syllabus" style="display:none;"><?php echo esc_textarea(is_array($syllabus) ? wp_json_encode($syllabus) : $syllabus_raw); ?></textarea>
        </div>

        <script>
        function addHighlightRow() {
            var container = document.getElementById('highlights-container');
            var div = document.createElement('div');
            div.style.cssText = 'display:flex; gap:8px; margin-bottom:6px;';
            div.innerHTML = '<input type="text" name="highlights_list[]" value="" style="flex:1; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" placeholder="e.g. 6 Real-world Capstone Projects" oninput="syncHighlights();" /><button type="button" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="this.parentElement.remove(); syncHighlights();">✕</button>';
            container.appendChild(div);
        }
        function syncHighlights() {
            var inputs = document.querySelectorAll('input[name="highlights_list[]"]');
            var list = [];
            inputs.forEach(function(inp) { if (inp.value.trim()) list.push(inp.value.trim()); });
            document.getElementById('highlights_json').value = JSON.stringify(list);
        }
        function addSyllabusModule() {
            var container = document.getElementById('syllabus-modules-container');
            var count = container.children.length + 1;
            var div = document.createElement('div');
            div.className = 'seeyam-module-item';
            div.style.cssText = 'background:#fff; border:1px solid #cbd5e1; border-radius:6px; padding:12px; margin-bottom:10px;';
            div.innerHTML = '<div style="display:flex; gap:8px; margin-bottom:8px;"><input type="text" class="mod-title" value="Module ' + count + ': New Topic" style="flex:2; font-weight:700; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" oninput="syncSyllabus();" /><input type="text" class="mod-duration" value="3 Weeks" style="flex:1; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px;" oninput="syncSyllabus();" /><button type="button" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="this.closest(\'.seeyam-module-item\').remove(); syncSyllabus();">Delete</button></div><div><label style="font-size:11px; font-weight:700; color:#64748b; display:block; margin-bottom:2px;">Topics Covered (Comma separated):</label><textarea class="mod-topics" rows="2" style="width:100%; border-radius:6px; border:1px solid #e2e8f0; font-size:12px; padding:6px;" oninput="syncSyllabus();"></textarea></div>';
            container.appendChild(div);
            syncSyllabus();
        }
        function syncSyllabus() {
            var items = document.querySelectorAll('.seeyam-module-item');
            var modules = [];
            items.forEach(function(item) {
                var title    = (item.querySelector('.mod-title') || {}).value || '';
                var duration = (item.querySelector('.mod-duration') || {}).value || '';
                var topicsRaw = (item.querySelector('.mod-topics') || {}).value || '';
                var topics = topicsRaw.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
                if (title.trim()) modules.push({ title: title.trim(), duration: duration.trim(), topics: topics });
            });
            document.getElementById('syllabus_json').value = JSON.stringify(modules);
        }
        </script>
        <?php
    }

    public function render_branch_metabox($post) {
        wp_nonce_field('seeyam_save_meta', 'seeyam_meta_nonce');
        $address   = get_post_meta($post->ID, 'address', true);
        $city      = get_post_meta($post->ID, 'city', true) ?: 'Chennai';
        $phone     = get_post_meta($post->ID, 'phone', true);
        $whatsapp  = get_post_meta($post->ID, 'whatsapp', true);
        $email     = get_post_meta($post->ID, 'email', true);
        $timing    = get_post_meta($post->ID, 'timing', true);
        $landmark  = get_post_meta($post->ID, 'landmark', true);
        $map       = get_post_meta($post->ID, 'map_embed_url', true);
        ?>
        <table class="form-table">
            <tr><th><label>Full Address</label></th><td><textarea name="address" rows="2" class="large-text"><?php echo esc_textarea($address); ?></textarea></td></tr>
            <tr><th><label>City</label></th><td><input type="text" name="city" value="<?php echo esc_attr($city); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Phone Number</label></th><td><input type="text" name="phone" value="<?php echo esc_attr($phone); ?>" class="regular-text" /></td></tr>
            <tr><th><label>WhatsApp Number</label></th><td><input type="text" name="whatsapp" value="<?php echo esc_attr($whatsapp); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Email Address</label></th><td><input type="email" name="email" value="<?php echo esc_attr($email); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Timing / Working Hours</label></th><td><input type="text" name="timing" value="<?php echo esc_attr($timing); ?>" class="regular-text" placeholder="Mon - Sun: 7:00 AM - 9:00 PM" /></td></tr>
            <tr><th><label>Nearby Landmark</label></th><td><input type="text" name="landmark" value="<?php echo esc_attr($landmark); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Google Maps Embed URL</label></th><td><input type="text" name="map_embed_url" value="<?php echo esc_attr($map); ?>" class="large-text code" /></td></tr>
        </table>
        <?php
    }

    public function render_placement_metabox($post) {
        wp_nonce_field('seeyam_save_meta', 'seeyam_meta_nonce');
        $name    = get_post_meta($post->ID, 'student_name', true);
        $company = get_post_meta($post->ID, 'company_name', true);
        $role    = get_post_meta($post->ID, 'role', true);
        $salary  = get_post_meta($post->ID, 'package_ctc', true);
        $avatar  = get_post_meta($post->ID, 'student_avatar_url', true);
        $quote   = get_post_meta($post->ID, 'quote', true);
        $course_id = get_post_meta($post->ID, 'course_id', true);
        $branch_id = get_post_meta($post->ID, 'branch_id', true);
        $courses   = get_posts(['post_type' => 'course', 'posts_per_page' => -1, 'post_status' => 'publish']);
        $branches  = get_posts(['post_type' => 'branch', 'posts_per_page' => -1, 'post_status' => 'publish']);
        ?>
        <table class="form-table">
            <tr><th><label>Student Full Name</label></th><td><input type="text" name="student_name" value="<?php echo esc_attr($name); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Hiring Company</label></th><td><input type="text" name="company_name" value="<?php echo esc_attr($company); ?>" class="regular-text" placeholder="e.g. Amazon, Microsoft, Zoho" /></td></tr>
            <tr><th><label>Designation / Role</label></th><td><input type="text" name="role" value="<?php echo esc_attr($role); ?>" class="regular-text" placeholder="e.g. Cloud DevOps Engineer" /></td></tr>
            <tr><th><label>Package CTC Offered</label></th><td><input type="text" name="package_ctc" value="<?php echo esc_attr($salary); ?>" class="regular-text" placeholder="e.g. 18.5 LPA" /></td></tr>
            <tr><th><label>Student Avatar Photo URL</label></th><td><input type="text" name="student_avatar_url" value="<?php echo esc_attr($avatar); ?>" class="large-text" /></td></tr>
            <tr>
                <th><label>Completed Course</label></th>
                <td>
                    <select name="course_id" class="regular-text">
                        <option value="">— Select Course —</option>
                        <?php foreach ($courses as $c): ?>
                            <option value="course-<?php echo esc_attr($c->post_name); ?>" <?php selected($course_id, 'course-' . $c->post_name); ?>><?php echo esc_html($c->post_title); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label>Campus Branch</label></th>
                <td>
                    <select name="branch_id" class="regular-text">
                        <option value="">— Select Branch —</option>
                        <?php foreach ($branches as $b): ?>
                            <option value="branch-<?php echo esc_attr($b->post_name); ?>" <?php selected($branch_id, 'branch-' . $b->post_name); ?>><?php echo esc_html($b->post_title); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr><th><label>Student Quote / Experience</label></th><td><textarea name="quote" rows="3" class="large-text"><?php echo esc_textarea($quote); ?></textarea></td></tr>
        </table>
        <?php
    }

    public function render_review_metabox($post) {
        wp_nonce_field('seeyam_save_meta', 'seeyam_meta_nonce');
        $student      = get_post_meta($post->ID, 'student_name', true);
        $student_email = get_post_meta($post->ID, 'student_email', true);
        $rating       = get_post_meta($post->ID, 'rating', true) ?: '5';
        $year         = get_post_meta($post->ID, 'completion_year', true) ?: date('Y');
        $status       = get_post_meta($post->ID, 'review_status', true) ?: 'APPROVED';
        $review_body  = $post->post_content; // stored in post_content
        $courses      = get_posts(['post_type' => 'course', 'posts_per_page' => -1, 'post_status' => 'publish']);
        $branches     = get_posts(['post_type' => 'branch', 'posts_per_page' => -1, 'post_status' => 'publish']);
        $course_id    = get_post_meta($post->ID, 'course_id', true);
        $branch_id    = get_post_meta($post->ID, 'branch_id', true);
        ?>
        <table class="form-table">
            <tr><th><label>Student Name</label></th><td><input type="text" name="student_name" value="<?php echo esc_attr($student); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Student Email</label></th><td><input type="email" name="student_email" value="<?php echo esc_attr($student_email); ?>" class="regular-text" /></td></tr>
            <tr>
                <th><label>Review Body / Testimonial *</label></th>
                <td>
                    <textarea name="review_body" rows="5" class="large-text" placeholder="Full student testimonial / review text..."><?php echo esc_textarea($review_body); ?></textarea>
                    <p class="description">This is the main review content displayed on the website.</p>
                </td>
            </tr>
            <tr><th><label>Rating (1–5 Stars)</label></th><td><input type="number" min="1" max="5" name="rating" value="<?php echo esc_attr($rating); ?>" class="small-text" /></td></tr>
            <tr><th><label>Completion Year</label></th><td><input type="text" name="completion_year" value="<?php echo esc_attr($year); ?>" class="small-text" /></td></tr>
            <tr>
                <th><label>Course Reviewed</label></th>
                <td>
                    <select name="course_id" class="regular-text">
                        <option value="">— Select Course —</option>
                        <?php foreach ($courses as $c): ?>
                            <option value="course-<?php echo esc_attr($c->post_name); ?>" <?php selected($course_id, 'course-' . $c->post_name); ?>><?php echo esc_html($c->post_title); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label>Campus Branch</label></th>
                <td>
                    <select name="branch_id" class="regular-text">
                        <option value="">— Select Branch —</option>
                        <?php foreach ($branches as $b): ?>
                            <option value="branch-<?php echo esc_attr($b->post_name); ?>" <?php selected($branch_id, 'branch-' . $b->post_name); ?>><?php echo esc_html($b->post_title); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label>Approval Status</label></th>
                <td>
                    <select name="review_status">
                        <option value="APPROVED" <?php selected($status, 'APPROVED'); ?>>✅ Approved (Live on website)</option>
                        <option value="PENDING"  <?php selected($status, 'PENDING');  ?>>⏳ Pending Moderation</option>
                        <option value="REJECTED" <?php selected($status, 'REJECTED'); ?>>❌ Rejected</option>
                    </select>
                </td>
            </tr>
        </table>
        <?php
    }

    public function render_batch_metabox($post) {
        wp_nonce_field('seeyam_save_meta', 'seeyam_meta_nonce');
        $instructor   = get_post_meta($post->ID, 'instructor_name', true);
        $exp          = get_post_meta($post->ID, 'instructor_exp', true);
        $start        = get_post_meta($post->ID, 'start_date', true);
        $timing       = get_post_meta($post->ID, 'timing', true);
        $max_seats    = get_post_meta($post->ID, 'max_seats', true) ?: '30';
        $seats_left   = get_post_meta($post->ID, 'seats_left', true);
        $batch_status = get_post_meta($post->ID, 'batch_status', true) ?: 'UPCOMING';
        $course_id    = get_post_meta($post->ID, 'course_id', true);
        $branch_id    = get_post_meta($post->ID, 'branch_id', true);
        $courses      = get_posts(['post_type' => 'course', 'posts_per_page' => -1, 'post_status' => 'publish']);
        $branches     = get_posts(['post_type' => 'branch', 'posts_per_page' => -1, 'post_status' => 'publish']);
        ?>
        <table class="form-table">
            <tr>
                <th><label>Assigned Course</label></th>
                <td>
                    <select name="course_id" class="regular-text">
                        <option value="">— Select Course —</option>
                        <?php foreach ($courses as $c): ?>
                            <option value="course-<?php echo esc_attr($c->post_name); ?>" <?php selected($course_id, 'course-' . $c->post_name); ?>><?php echo esc_html($c->post_title); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label>Campus Branch</label></th>
                <td>
                    <select name="branch_id" class="regular-text">
                        <option value="">— Select Branch —</option>
                        <?php foreach ($branches as $b): ?>
                            <option value="branch-<?php echo esc_attr($b->post_name); ?>" <?php selected($branch_id, 'branch-' . $b->post_name); ?>><?php echo esc_html($b->post_title); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr><th><label>Lead Mentor / Instructor Name</label></th><td><input type="text" name="instructor_name" value="<?php echo esc_attr($instructor); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Instructor Industry Experience</label></th><td><input type="text" name="instructor_exp" value="<?php echo esc_attr($exp); ?>" class="regular-text" placeholder="12+ Yrs Exp" /></td></tr>
            <tr><th><label>Batch Start Date</label></th><td><input type="date" name="start_date" value="<?php echo esc_attr($start); ?>" class="regular-text" /></td></tr>
            <tr><th><label>Batch Timings</label></th><td><input type="text" name="timing" value="<?php echo esc_attr($timing); ?>" class="regular-text" placeholder="Mon - Fri: 7:30 AM - 9:30 AM" /></td></tr>
            <tr>
                <th><label>Total Seats Capacity</label></th>
                <td>
                    <input type="number" name="max_seats" value="<?php echo esc_attr($max_seats); ?>" class="small-text" min="1" />
                    <span style="margin-left:12px; font-weight:700; color:#64748b;">Seats Left:</span>
                    <input type="number" name="seats_left" value="<?php echo esc_attr($seats_left); ?>" class="small-text" min="0" style="margin-left:6px;" />
                </td>
            </tr>
            <tr>
                <th><label>Batch Status</label></th>
                <td>
                    <select name="batch_status" class="regular-text">
                        <option value="UPCOMING"  <?php selected($batch_status, 'UPCOMING');  ?>>🟡 UPCOMING</option>
                        <option value="ONGOING"   <?php selected($batch_status, 'ONGOING');   ?>>🟢 ONGOING</option>
                        <option value="COMPLETED" <?php selected($batch_status, 'COMPLETED'); ?>>✅ COMPLETED</option>
                    </select>
                </td>
            </tr>
        </table>
        <?php
    }

    public function save_meta_boxes_data($post_id) {
        if (!isset($_POST['seeyam_meta_nonce']) || !wp_verify_nonce($_POST['seeyam_meta_nonce'], 'seeyam_save_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        // Highlights
        if (isset($_POST['highlights_list']) && is_array($_POST['highlights_list'])) {
            $cleaned = array_values(array_filter(array_map('sanitize_text_field', $_POST['highlights_list'])));
            update_post_meta($post_id, 'highlights', wp_json_encode($cleaned));
        } elseif (isset($_POST['highlights'])) {
            update_post_meta($post_id, 'highlights', wp_unslash($_POST['highlights']));
        }

        // Syllabus
        if (isset($_POST['syllabus'])) {
            update_post_meta($post_id, 'syllabus', wp_unslash($_POST['syllabus']));
        }

        // Review body — saved as post_content
        if (isset($_POST['review_body']) && get_post_type($post_id) === 'review') {
            wp_update_post(['ID' => $post_id, 'post_content' => wp_kses_post(wp_unslash($_POST['review_body']))]);
        }

        // New counselor note for Leads
        if (!empty($_POST['new_counselor_note'])) {
            $current_notes_raw = get_post_meta($post_id, 'notes_json', true);
            $current_notes     = is_string($current_notes_raw) ? (json_decode($current_notes_raw, true) ?: []) : ($current_notes_raw ?: []);
            $current_user      = wp_get_current_user();
            array_unshift($current_notes, [
                'id'        => 'note-' . time(),
                'timestamp' => current_time('mysql'),
                'text'      => sanitize_text_field($_POST['new_counselor_note']),
                'author'    => $current_user->display_name ?: 'Counselor',
            ]);
            update_post_meta($post_id, 'notes_json', wp_json_encode($current_notes));
        }

        $scalar_fields = [
            'summary', 'duration', 'mode', 'price', 'starting_price', 'brochure_pdf_url', 'expected_salary', 'rating', 'enrolled_count', 'hiring_partners',
            'address', 'city', 'phone', 'whatsapp', 'email', 'timing', 'landmark', 'map_embed_url',
            'student_name', 'student_phone', 'student_email', 'course_id', 'branch_id', 'lead_status', 'source',
            'company_name', 'role', 'package_ctc', 'student_avatar_url', 'quote',
            'completion_year', 'review_status', 'review_title',
            'instructor_name', 'instructor_exp', 'start_date', 'max_seats', 'seats_left', 'batch_status',
            'seo_title', 'seo_description', 'seo_keywords',
            'faq_category', 'order_num', 'category', 'answer',
            'resource_type', 'file_url', 'file_size',
            'site_name', 'url', 'role_filter', 'badge',
        ];

        foreach ($scalar_fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $field, sanitize_text_field(wp_unslash($_POST[$field])));
            }
        }

        if (isset($_POST['is_featured'])) {
            update_post_meta($post_id, 'is_featured', 1);
        } elseif (get_post_type($post_id) === 'course') {
            update_post_meta($post_id, 'is_featured', 0);
        }
    }

    /* -------------------------------------------------------------------------
     * 6. ADMIN MENU & QUICK LINKS
     * ---------------------------------------------------------------------- */

    public function register_admin_menu() {
        add_menu_page(
            'Seeyam Platform Settings',
            'Seeyam CMS',
            'manage_options',
            'seeyam-settings',
            [$this, 'render_settings_page'],
            'dashicons-superhero',
            3
        );
    }

    public function add_admin_bar_quick_links($admin_bar) {
        if (!current_user_can('manage_options')) return;
        $frontend_url = 'http://localhost:3000';

        $admin_bar->add_node(['id' => 'seeyam-live-site', 'title' => '<span class="ab-icon dashicons dashicons-external" style="color:#38bdf8; margin-top:2px;"></span> <span style="font-weight:700; color:#fff;">Live Next.js Site</span>', 'href' => $frontend_url, 'meta' => ['target' => '_blank', 'title' => 'Open Next.js Live Frontend']]);

        $links = [['home','🏠 Homepage','/'], ['courses','🎓 Courses','/courses'], ['branches','📍 Campuses','/branches'], ['placements','🏆 Placements','/placements'], ['reviews','⭐ Reviews','/reviews'], ['about','ℹ️ About Us','/about'], ['contact','📞 Contact','/contact']];
        foreach ($links as [$id, $title, $path]) {
            $admin_bar->add_node(['id' => 'seeyam-live-' . $id, 'parent' => 'seeyam-live-site', 'title' => $title, 'href' => $frontend_url . $path, 'meta' => ['target' => '_blank']]);
        }
    }

    public function register_settings() {
        register_setting('seeyam_settings_group', 'seeyam_site_options', [$this, 'sanitize_site_options']);
    }

    public function sanitize_site_options($input) {
        $existing = get_option('seeyam_site_options', []);
        if (!is_array($existing)) $existing = [];
        if (!is_array($input)) $input = [];
        $merged = array_merge($existing, $input);
        return $this->remove_retired_scroll_settings($merged);
    }

    /* -------------------------------------------------------------------------
     * 7. SETTINGS PAGE
     * ---------------------------------------------------------------------- */

    public function render_settings_page() {
        $options    = wp_parse_args(get_option('seeyam_site_options', []), $this->get_default_settings());
        $options    = $this->remove_retired_scroll_settings($options);
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'appearance';
        $frontend   = 'http://localhost:3000';
        ?>
        <div class="wrap" style="max-width:1100px;">
            <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; margin-bottom:20px; background:#071938; padding:18px 24px; border-radius:12px; color:#fff; box-shadow:0 4px 12px rgba(7,25,56,.15);">
                <div style="display:flex; align-items:center; gap:12px;">
                    <span class="dashicons dashicons-superhero" style="font-size:36px; width:36px; height:36px; color:#60a5fa;"></span>
                    <div>
                        <h1 style="color:#fff; margin:0; font-size:22px; font-weight:800;">Seeyam Headless CMS — Settings &amp; Theme Customizer <span style="font-size:12px; font-weight:600; background:#1e3a8a; padding:2px 8px; border-radius:6px; margin-left:8px;">v2.0.0</span></h1>
                        <p style="margin:4px 0 0 0; color:#94a3b8; font-size:12px;">Full control of frontend themes, SEO, hero banners, brand identity, and about page content.</p>
                    </div>
                </div>
                <a href="<?php echo esc_url($frontend); ?>" target="_blank" class="button" style="background:#2563eb; color:#fff; border-color:#1d4ed8; font-weight:700; display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:8px; height:auto;">
                    <span class="dashicons dashicons-external" style="margin-top:2px;"></span> 🌐 Open Live Frontend
                </a>
            </div>

            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:10px 16px; margin-bottom:20px; display:flex; align-items:center; flex-wrap:wrap; gap:10px;">
                <span style="font-size:12px; font-weight:700; color:#475569;">🚀 Quick Previews:</span>
                <?php
                $pages = [['🏠 Home', '/'], ['🎓 Courses', '/courses'], ['📍 Campuses', '/branches'], ['🏆 Placements', '/placements'], ['⭐ Reviews', '/reviews'], ['ℹ️ About', '/about'], ['📞 Contact', '/contact']];
                foreach ($pages as [$label, $path]) {
                    echo '<a href="' . esc_url($frontend . $path) . '" target="_blank" style="text-decoration:none; font-size:12px; font-weight:600; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; padding:4px 10px; border-radius:6px;">' . esc_html($label) . '</a>';
                }
                ?>
            </div>

            <nav class="nav-tab-wrapper" style="margin-bottom:20px;">
                <?php
                $tabs = [
                    'appearance'   => '🎨 Appearance',
                    'seo'          => '🔍 SEO & Social',
                    'content'      => '📝 Hero & Sections',
                    'brand_footer' => '🏷️ Brand & Footer',
                    'about_faq'    => '📖 About & FAQs',
                    'advanced'     => '⚙️ Advanced / Security',
                ];
                foreach ($tabs as $slug => $label) {
                    $class = ($active_tab === $slug) ? 'nav-tab-active' : '';
                    echo '<a href="?page=seeyam-settings&tab=' . esc_attr($slug) . '" class="nav-tab ' . $class . '" style="font-weight:700;">' . esc_html($label) . '</a>';
                }
                ?>
            </nav>

            <?php if (isset($_GET['seeded'])): ?>
                <div class="notice notice-success is-dismissible"><p><strong>Success!</strong> All content seeded into WordPress successfully!</p></div>
            <?php endif; ?>

            <form method="post" action="options.php" style="background:#fff; border:1px solid #cbd5e1; padding:28px; border-radius:12px; box-shadow:0 4px 6px -1px rgba(0,0,0,.05);">
                <?php settings_fields('seeyam_settings_group'); ?>

                <?php if ($active_tab === 'appearance'): ?>
                    <?php $this->render_appearance_tab($options); ?>
                <?php elseif ($active_tab === 'seo'): ?>
                    <?php $this->render_seo_tab($options); ?>
                <?php elseif ($active_tab === 'content'): ?>
                    <?php $this->render_content_tab($options, $frontend); ?>
                <?php elseif ($active_tab === 'brand_footer'): ?>
                    <?php $this->render_brand_footer_tab($options); ?>
                <?php elseif ($active_tab === 'about_faq'): ?>
                    <?php $this->render_about_faq_tab($options); ?>
                <?php elseif ($active_tab === 'advanced'): ?>
                    <?php $this->render_advanced_tab($options); ?>
                <?php endif; ?>

                <div style="margin-top:28px; padding-top:18px; border-top:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between;">
                    <?php submit_button('💾 Save All Seeyam Settings', 'primary button-hero', 'submit', false); ?>
                    <a href="<?php echo esc_url($frontend); ?>" target="_blank" style="font-weight:700; color:#2563eb; font-size:13px;">🌐 View Live Site &rarr;</a>
                </div>
            </form>
        </div>
        <?php
    }

    private function render_appearance_tab($options) { ?>
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:16px; margin-bottom:24px;">
            <h3 style="margin-top:0; color:#1e40af;">✨ Live React Frontend Theme Customizer</h3>
            <p style="margin-bottom:0; color:#3b82f6; font-size:13px;">Changes here instantly transform colors, brand themes, Google Fonts, and border radius across the entire Next.js application.</p>
        </div>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">1. Color Palette & Theme Preset</h2>
        <table class="form-table">
            <tr>
                <th><label style="font-weight:700;">Curated Theme Preset</label></th>
                <td>
                    <select name="seeyam_site_options[theme_preset]" id="theme_preset_select" onchange="applyPresetColors(this.value);" style="height:38px; border-radius:6px; font-weight:600; min-width:260px;">
                        <option value="default"  <?php selected($options['theme_preset'] ?? 'default', 'default'); ?>>🔵 Royal Blue & Orange (Default Seeyam)</option>
                        <option value="emerald"  <?php selected($options['theme_preset'] ?? '', 'emerald'); ?>>🟢 Emerald Tech & Gold</option>
                        <option value="violet"   <?php selected($options['theme_preset'] ?? '', 'violet'); ?>>🟣 AI Violet & Hot Pink</option>
                        <option value="indigo"   <?php selected($options['theme_preset'] ?? '', 'indigo'); ?>>🌌 Deep Indigo & Cyan</option>
                        <option value="crimson"  <?php selected($options['theme_preset'] ?? '', 'crimson'); ?>>🔴 Cyber Crimson & Obsidian</option>
                        <option value="custom"   <?php selected($options['theme_preset'] ?? '', 'custom'); ?>>🎨 Custom Palette (Set Below)</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label style="font-weight:700;">Primary Brand Color</label></th>
                <td><input type="text" name="seeyam_site_options[primary_color]" id="primary_color" value="<?php echo esc_attr($options['primary_color'] ?? '#2563eb'); ?>" class="seeyam-color-field" data-default-color="#2563eb" /></td>
            </tr>
            <tr>
                <th><label style="font-weight:700;">Secondary / Accent Color</label></th>
                <td><input type="text" name="seeyam_site_options[accent_color]" id="accent_color" value="<?php echo esc_attr($options['accent_color'] ?? '#d4af37'); ?>" class="seeyam-color-field" data-default-color="#d4af37" /></td>
            </tr>
            <tr>
                <th><label style="font-weight:700;">Dark Banner & Navy Background</label></th>
                <td><input type="text" name="seeyam_site_options[dark_color]" id="dark_color" value="<?php echo esc_attr($options['dark_color'] ?? '#071938'); ?>" class="seeyam-color-field" data-default-color="#071938" /></td>
            </tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">2. Typography & Fonts</h2>
        <table class="form-table">
            <tr>
                <th><label style="font-weight:700;">Google Font Family</label></th>
                <td>
                    <select name="seeyam_site_options[font_family]" style="height:38px; border-radius:6px; font-weight:600; min-width:260px;">
                        <?php $fonts = ['Inter' => 'Inter (Clean & Professional)', 'Plus Jakarta Sans' => 'Plus Jakarta Sans (Modern SaaS)', 'Outfit' => 'Outfit (Contemporary & Sleek)', 'Poppins' => 'Poppins (Friendly & Rounded)', 'Roboto' => 'Roboto (Standard Clean)', 'Space Grotesk' => 'Space Grotesk (Cutting-Edge AI)', 'Lexend' => 'Lexend (Ultra Readable)', 'DM Sans' => 'DM Sans (Corporate & Elegant)']; ?>
                        <?php foreach ($fonts as $val => $label): ?>
                            <option value="<?php echo esc_attr($val); ?>" <?php selected($options['font_family'] ?? 'Inter', $val); ?>><?php echo esc_html($label); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <th><label style="font-weight:700;">Card Corner Radius</label></th>
                <td>
                    <select name="seeyam_site_options[border_radius]" style="height:38px; border-radius:6px; font-weight:600; min-width:260px;">
                        <option value="12px" <?php selected($options['border_radius'] ?? '', '12px'); ?>>Subtle Rounded (12px)</option>
                        <option value="16px" <?php selected($options['border_radius'] ?? '', '16px'); ?>>Medium Rounded (16px)</option>
                        <option value="24px" <?php selected($options['border_radius'] ?? '24px', '24px'); ?>>Modern Rounded — Default (24px)</option>
                        <option value="32px" <?php selected($options['border_radius'] ?? '', '32px'); ?>>Ultra Rounded (32px)</option>
                    </select>
                </td>
            </tr>
        </table>
        <script>
        jQuery(document).ready(function($){ $('.seeyam-color-field').wpColorPicker(); });
        function applyPresetColors(preset) {
            var presets = { default:{primary:'#2563eb',accent:'#d4af37',dark:'#071938'}, emerald:{primary:'#059669',accent:'#f59e0b',dark:'#06281e'}, violet:{primary:'#7c3aed',accent:'#ec4899',dark:'#1e1035'}, indigo:{primary:'#4f46e5',accent:'#06b6d4',dark:'#0b132b'}, crimson:{primary:'#e11d48',accent:'#0284c7',dark:'#0f172a'} };
            if (presets[preset]) { jQuery('#primary_color').wpColorPicker('color', presets[preset].primary); jQuery('#accent_color').wpColorPicker('color', presets[preset].accent); jQuery('#dark_color').wpColorPicker('color', presets[preset].dark); }
        }
        </script>
    <?php }

    private function render_seo_tab($options) { ?>
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:16px; margin-bottom:24px;">
            <h3 style="margin-top:0; color:#166534;">🔍 Global SEO, Social Graph & Analytics Config</h3>
            <p style="margin-bottom:0; color:#15803d; font-size:13px;">Manage page meta titles, Open Graph sharing cards, Google Analytics IDs, and Organization Schema JSON-LD.</p>
        </div>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">1. Search Engine Metadata</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Global Site Title</label></th><td><input type="text" name="seeyam_site_options[seo_site_title]" value="<?php echo esc_attr($options['seo_site_title'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Global Meta Description</label></th><td><textarea name="seeyam_site_options[seo_meta_desc]" rows="3" class="large-text"><?php echo esc_textarea($options['seo_meta_desc'] ?? ''); ?></textarea></td></tr>
            <tr><th><label style="font-weight:700;">Target Keywords</label></th><td><input type="text" name="seeyam_site_options[seo_keywords]" value="<?php echo esc_attr($options['seo_keywords'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Canonical Base URL</label></th><td><input type="text" name="seeyam_site_options[seo_canonical_url]" value="<?php echo esc_attr($options['seo_canonical_url'] ?? 'http://localhost:3000'); ?>" class="regular-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">2. Social Graph (Open Graph & Twitter Cards)</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">OG Social Share Image URL</label></th><td><input type="text" name="seeyam_site_options[seo_og_image]" value="<?php echo esc_attr($options['seo_og_image'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Twitter / X Handle</label></th><td><input type="text" name="seeyam_site_options[seo_twitter_handle]" value="<?php echo esc_attr($options['seo_twitter_handle'] ?? '@seeyamtech'); ?>" class="regular-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">3. Analytics & Webmaster Verification</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Google Analytics 4 Measurement ID</label></th><td><input type="text" name="seeyam_site_options[seo_ga_id]" value="<?php echo esc_attr($options['seo_ga_id'] ?? ''); ?>" class="regular-text" placeholder="G-XXXXXXXXXX" /></td></tr>
            <tr><th><label style="font-weight:700;">Google Tag Manager ID</label></th><td><input type="text" name="seeyam_site_options[seo_gtm_id]" value="<?php echo esc_attr($options['seo_gtm_id'] ?? ''); ?>" class="regular-text" placeholder="GTM-XXXXXXX" /></td></tr>
            <tr>
                <th><label style="font-weight:700;">Robots Indexing</label></th>
                <td>
                    <select name="seeyam_site_options[seo_robots]" style="height:38px; border-radius:6px;">
                        <option value="index, follow"    <?php selected($options['seo_robots'] ?? 'index, follow', 'index, follow'); ?>>Index, Follow (Recommended for Live)</option>
                        <option value="noindex, nofollow" <?php selected($options['seo_robots'] ?? '', 'noindex, nofollow'); ?>>NoIndex, NoFollow (Staging / Private)</option>
                    </select>
                </td>
            </tr>
        </table>
    <?php }

    private function render_content_tab($options, $frontend = 'http://localhost:3000') { ?>
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:16px; margin-bottom:24px;">
            <h3 style="margin-top:0; color:#0369a1;">📝 Homepage Hero, Stats, Sections & CTA</h3>
            <p style="margin-bottom:0; color:#0284c7; font-size:13px;">Manage hero copy, value props, YouTube video, stats counter, section headings, and CTA banners. <a href="<?php echo esc_url($frontend); ?>" target="_blank" style="font-weight:700;">Preview &rarr;</a></p>
        </div>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">1. Hero Header Section</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Top Badge Text</label></th><td><input type="text" name="seeyam_site_options[hero_badge]" value="<?php echo esc_attr($options['hero_badge'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Hero Headline</label></th><td><input type="text" name="seeyam_site_options[hero_headline]" value="<?php echo esc_attr($options['hero_headline'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Hero Subtitle</label></th><td><textarea name="seeyam_site_options[hero_subtitle]" rows="3" class="large-text"><?php echo esc_textarea($options['hero_subtitle'] ?? ''); ?></textarea></td></tr>
            <tr><th><label style="font-weight:700;">Value Prop Bullet 1</label></th><td><input type="text" name="seeyam_site_options[hero_val_prop_1]" value="<?php echo esc_attr($options['hero_val_prop_1'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Value Prop Bullet 2</label></th><td><input type="text" name="seeyam_site_options[hero_val_prop_2]" value="<?php echo esc_attr($options['hero_val_prop_2'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Value Prop Bullet 3</label></th><td><input type="text" name="seeyam_site_options[hero_val_prop_3]" value="<?php echo esc_attr($options['hero_val_prop_3'] ?? ''); ?>" class="regular-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">2. Hero Video Showcase</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">YouTube Video URL</label></th><td><input type="text" name="seeyam_site_options[hero_youtube_url]" value="<?php echo esc_attr($options['hero_youtube_url'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Video Card Title</label></th><td><input type="text" name="seeyam_site_options[hero_video_title]" value="<?php echo esc_attr($options['hero_video_title'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Video Card Subtitle</label></th><td><input type="text" name="seeyam_site_options[hero_video_subtitle]" value="<?php echo esc_attr($options['hero_video_subtitle'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Video Floating Badge</label></th><td><input type="text" name="seeyam_site_options[hero_video_badge]" value="<?php echo esc_attr($options['hero_video_badge'] ?? ''); ?>" class="regular-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">3. Stats Counter Bar</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Engineers Trained Value &amp; Label</label></th><td><input type="text" name="seeyam_site_options[stat_engineers]" value="<?php echo esc_attr($options['stat_engineers'] ?? '50,000+'); ?>" class="small-text" style="font-weight:700;" /> <input type="text" name="seeyam_site_options[stat_engineers_label]" value="<?php echo esc_attr($options['stat_engineers_label'] ?? 'Engineers Trained'); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Campuses Stat Label</label></th><td><input type="text" name="seeyam_site_options[stat_branches_label]" value="<?php echo esc_attr($options['stat_branches_label'] ?? 'Campus Locations'); ?>" class="regular-text" /> <span style="font-size:12px; color:#64748b;">(Value auto-calculated from Branches CPT)</span></td></tr>
            <tr><th><label style="font-weight:700;">Placement Value &amp; Label</label></th><td><input type="text" name="seeyam_site_options[stat_placement]" value="<?php echo esc_attr($options['stat_placement'] ?? '100%'); ?>" class="small-text" style="font-weight:700;" /> <input type="text" name="seeyam_site_options[stat_placement_label]" value="<?php echo esc_attr($options['stat_placement_label'] ?? 'Placement Assistance'); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Rating Value &amp; Label</label></th><td><input type="text" name="seeyam_site_options[stat_rating]" value="<?php echo esc_attr($options['stat_rating'] ?? '4.9★'); ?>" class="small-text" style="font-weight:700;" /> <input type="text" name="seeyam_site_options[stat_rating_label]" value="<?php echo esc_attr($options['stat_rating_label'] ?? 'Student Rating'); ?>" class="regular-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">4. Hiring Recruiter Network Strip</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Strip Label</label></th><td><input type="text" name="seeyam_site_options[hiring_network_title]" value="<?php echo esc_attr($options['hiring_network_title'] ?? 'Top Hiring Recruiter Network:'); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Partner Logos (Comma separated)</label></th><td><input type="text" name="seeyam_site_options[hiring_partners]" value="<?php echo esc_attr($options['hiring_partners'] ?? ''); ?>" class="large-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">5. Section Headings & Badges</h2>
        <table class="form-table">
            <?php $sections = [['courses','Featured Courses'],['placements','Placements'],['reviews','Reviews'],['branches','Campuses']]; ?>
            <?php foreach ($sections as [$key, $label]): ?>
            <tr>
                <th><label style="font-weight:700;"><?php echo esc_html($label); ?> Section</label></th>
                <td>
                    <input type="text" name="seeyam_site_options[sec_<?php echo esc_attr($key); ?>_badge]" value="<?php echo esc_attr($options['sec_' . $key . '_badge'] ?? ''); ?>" placeholder="Badge" class="regular-text" style="margin-bottom:6px;" /><br/>
                    <input type="text" name="seeyam_site_options[sec_<?php echo esc_attr($key); ?>_title]" value="<?php echo esc_attr($options['sec_' . $key . '_title'] ?? ''); ?>" placeholder="Section Heading" class="large-text" />
                </td>
            </tr>
            <?php endforeach; ?>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">6. Call-To-Action (CTA) Banner</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">CTA Headline</label></th><td><input type="text" name="seeyam_site_options[cta_title]" value="<?php echo esc_attr($options['cta_title'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">CTA Subtitle</label></th><td><textarea name="seeyam_site_options[cta_subtitle]" rows="2" class="large-text"><?php echo esc_textarea($options['cta_subtitle'] ?? ''); ?></textarea></td></tr>
            <tr><th><label style="font-weight:700;">Primary Button Text</label></th><td><input type="text" name="seeyam_site_options[cta_btn1_text]" value="<?php echo esc_attr($options['cta_btn1_text'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Secondary Button Text</label></th><td><input type="text" name="seeyam_site_options[cta_btn2_text]" value="<?php echo esc_attr($options['cta_btn2_text'] ?? ''); ?>" class="regular-text" /></td></tr>
        </table>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:16px; border-radius:8px; margin-top:24px;">
            <h4 style="margin-top:0;">⚡ One-Click Content Seeder</h4>
            <p style="font-size:12px; color:#64748b;">Re-populate standard courses, branches, reviews, batches, and placements into WordPress.</p>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="seeyam_seed_data" />
                <?php wp_nonce_field('seeyam_seed_action', 'seeyam_seed_nonce'); ?>
                <button type="submit" class="button button-secondary" onclick="return confirm('Re-seed all default content? Existing entries will be updated.');">🔄 Re-Seed Default Content</button>
            </form>
        </div>
    <?php }

    private function render_brand_footer_tab($options) { ?>
        <div style="background:#fdf4ff; border:1px solid #f0abfc; border-radius:8px; padding:16px; margin-bottom:24px;">
            <h3 style="margin-top:0; color:#86198f;">🏷️ Brand Identity, Navigation Badges & Footer Information</h3>
        </div>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">1. Brand Logo & Identity</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Brand Name (Primary)</label></th><td><input type="text" name="seeyam_site_options[brand_name_1]" value="<?php echo esc_attr($options['brand_name_1'] ?? 'SEEYAM'); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Brand Name (Accent)</label></th><td><input type="text" name="seeyam_site_options[brand_name_2]" value="<?php echo esc_attr($options['brand_name_2'] ?? 'TECHNOLOGIES'); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Brand Tagline</label></th><td><input type="text" name="seeyam_site_options[brand_tagline]" value="<?php echo esc_attr($options['brand_tagline'] ?? 'IT Training • Certification • Placement'); ?>" class="large-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">2. Navbar Top Utility Bar Trust Badges</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Trust Badge 1</label></th><td><input type="text" name="seeyam_site_options[navbar_badge_1]" value="<?php echo esc_attr($options['navbar_badge_1'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Trust Badge 2</label></th><td><input type="text" name="seeyam_site_options[navbar_badge_2]" value="<?php echo esc_attr($options['navbar_badge_2'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Trust Badge 3</label></th><td><input type="text" name="seeyam_site_options[navbar_badge_3]" value="<?php echo esc_attr($options['navbar_badge_3'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Default Helpline Phone</label></th><td><input type="text" name="seeyam_site_options[navbar_helpline_phone]" value="<?php echo esc_attr($options['navbar_helpline_phone'] ?? ''); ?>" class="regular-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">3. Footer Content & Accreditations</h2>
        <table class="form-table">
            <tr><th><label style="font-weight:700;">Footer About / Bio Text</label></th><td><textarea name="seeyam_site_options[footer_about_text]" rows="3" class="large-text"><?php echo esc_textarea($options['footer_about_text'] ?? ''); ?></textarea></td></tr>
            <tr><th><label style="font-weight:700;">Footer Badge 1</label></th><td><input type="text" name="seeyam_site_options[footer_badge_1]" value="<?php echo esc_attr($options['footer_badge_1'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Footer Badge 2</label></th><td><input type="text" name="seeyam_site_options[footer_badge_2]" value="<?php echo esc_attr($options['footer_badge_2'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Contact Phone</label></th><td><input type="text" name="seeyam_site_options[footer_phone]" value="<?php echo esc_attr($options['footer_phone'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Contact Email</label></th><td><input type="text" name="seeyam_site_options[footer_email]" value="<?php echo esc_attr($options['footer_email'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Working Hours</label></th><td><input type="text" name="seeyam_site_options[footer_hours]" value="<?php echo esc_attr($options['footer_hours'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Copyright Company Name</label></th><td><input type="text" name="seeyam_site_options[footer_copyright]" value="<?php echo esc_attr($options['footer_copyright'] ?? ''); ?>" class="large-text" /></td></tr>
        </table>
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">4. Social Media Profiles</h2>
        <table class="form-table">
            <?php $socials = ['facebook' => 'Facebook', 'instagram' => 'Instagram', 'linkedin' => 'LinkedIn', 'youtube' => 'YouTube Channel', 'twitter' => 'Twitter / X']; ?>
            <?php foreach ($socials as $key => $label): ?>
                <tr><th><label style="font-weight:700;"><?php echo esc_html($label); ?> URL</label></th><td><input type="text" name="seeyam_site_options[social_<?php echo esc_attr($key); ?>]" value="<?php echo esc_attr($options['social_' . $key] ?? ''); ?>" class="large-text" /></td></tr>
            <?php endforeach; ?>
        </table>
    <?php }

    private function render_about_faq_tab($options) {
        // Parse existing JSON data for visual builders
        $faqs       = json_decode($options['faq_items_json']      ?? '[]', true) ?: [];
        $trainers   = json_decode($options['about_trainers_json'] ?? '[]', true) ?: [];
        $milestones = json_decode($options['about_milestones_json']?? '[]', true) ?: [];
        $pillars    = json_decode($options['about_pillars_json']  ?? '[]', true) ?: [];

        $row_style    = 'background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:14px; margin-bottom:10px; position:relative;';
        $label_style  = 'font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:4px;';
        $input_style  = 'width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;';
        $ta_style     = 'width:100%; border-radius:6px; border:1px solid #cbd5e1; padding:8px; font-size:12px; box-sizing:border-box;';
        $del_btn      = 'background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; position:absolute; top:14px; right:14px;';
        $section_box  = 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:28px;';
        $add_btn      = 'margin-top:8px; font-size:13px;';
        ?>
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:16px; margin-bottom:24px;">
            <h3 style="margin-top:0; color:#92400e;">📖 About Us Page Content & FAQ Manager</h3>
            <p style="margin-bottom:0; color:#b45309; font-size:13px;">All sections use visual builders — no raw JSON needed. Click "Add" to insert new rows and "✕" to remove them. Settings auto-sync on save.</p>
        </div>

        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">1. About Page Header Banner</h2>
        <table class="form-table" style="margin-bottom:24px;">
            <tr><th><label style="font-weight:700;">Header Top Badge</label></th><td><input type="text" name="seeyam_site_options[about_hero_badge]" value="<?php echo esc_attr($options['about_hero_badge'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Header Main Headline</label></th><td><input type="text" name="seeyam_site_options[about_hero_title]" value="<?php echo esc_attr($options['about_hero_title'] ?? ''); ?>" class="large-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Header Subtitle</label></th><td><textarea name="seeyam_site_options[about_hero_subtitle]" rows="3" class="large-text"><?php echo esc_textarea($options['about_hero_subtitle'] ?? ''); ?></textarea></td></tr>
        </table>

        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">2. Mission & Vision Statements</h2>
        <table class="form-table" style="margin-bottom:24px;">
            <tr><th><label style="font-weight:700;">Mission Section Title</label></th><td><input type="text" name="seeyam_site_options[about_mission_title]" value="<?php echo esc_attr($options['about_mission_title'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Mission Statement</label></th><td><textarea name="seeyam_site_options[about_mission_text]" rows="3" class="large-text"><?php echo esc_textarea($options['about_mission_text'] ?? ''); ?></textarea></td></tr>
            <tr><th><label style="font-weight:700;">Vision Section Title</label></th><td><input type="text" name="seeyam_site_options[about_vision_title]" value="<?php echo esc_attr($options['about_vision_title'] ?? ''); ?>" class="regular-text" /></td></tr>
            <tr><th><label style="font-weight:700;">Vision Statement</label></th><td><textarea name="seeyam_site_options[about_vision_text]" rows="3" class="large-text"><?php echo esc_textarea($options['about_vision_text'] ?? ''); ?></textarea></td></tr>
        </table>

        <!-- ── FAQ BUILDER ─────────────────────────────────────────────────── -->
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">3. FAQ Accordion Items</h2>
        <div style="<?php echo $section_box; ?>">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <p style="margin:0; font-size:13px; color:#475569;">Build the FAQ accordion displayed on the Contact page. Click <strong>+ Add FAQ</strong> to add new Q&amp;A pairs.</p>
                <button type="button" class="button button-primary" onclick="seeyamAddFAQ();" style="<?php echo $add_btn; ?>">+ Add FAQ Item</button>
            </div>
            <div id="seeyam-faq-builder">
                <?php foreach ($faqs as $faq): ?>
                    <div class="seeyam-faq-row" style="<?php echo $row_style; ?>">
                        <button type="button" onclick="this.closest('.seeyam-faq-row').remove(); seeyamSyncFAQs();" style="<?php echo $del_btn; ?>">✕ Remove</button>
                        <div style="display:grid; gap:10px; padding-right:80px;">
                            <div>
                                <label style="<?php echo $label_style; ?>">❓ Question</label>
                                <input type="text" class="faq-q" value="<?php echo esc_attr($faq['q'] ?? ''); ?>" oninput="seeyamSyncFAQs();" style="<?php echo $input_style; ?>" placeholder="e.g. How does the 100% placement guarantee work?" />
                            </div>
                            <div>
                                <label style="<?php echo $label_style; ?>">💬 Answer</label>
                                <textarea class="faq-a" rows="3" oninput="seeyamSyncFAQs();" style="<?php echo $ta_style; ?>" placeholder="Detailed answer text..."><?php echo esc_textarea($faq['a'] ?? ''); ?></textarea>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <textarea id="seeyam_faq_json_sync" name="seeyam_site_options[faq_items_json]" style="display:none;"><?php echo esc_textarea(wp_json_encode($faqs)); ?></textarea>
        </div>

        <!-- ── TRAINERS BUILDER ────────────────────────────────────────────── -->
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">4. Senior Faculty & Mentors</h2>
        <div style="<?php echo $section_box; ?>">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <p style="margin:0; font-size:13px; color:#475569;">Trainer cards displayed on the About page. Each row has Name, Role, Experience, Bio, Avatar URL, and Tags.</p>
                <button type="button" class="button button-primary" onclick="seeyamAddTrainer();" style="<?php echo $add_btn; ?>">+ Add Trainer</button>
            </div>
            <div id="seeyam-trainers-builder">
                <?php foreach ($trainers as $t): ?>
                    <div class="seeyam-trainer-row" style="<?php echo $row_style; ?>">
                        <button type="button" onclick="this.closest('.seeyam-trainer-row').remove(); seeyamSyncTrainers();" style="<?php echo $del_btn; ?>">✕ Remove</button>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:80px; margin-bottom:10px;">
                            <div><label style="<?php echo $label_style; ?>">Full Name</label><input type="text" class="tr-name" value="<?php echo esc_attr($t['name'] ?? ''); ?>" oninput="seeyamSyncTrainers();" style="<?php echo $input_style; ?>" placeholder="Dr. Ananya Sundaram" /></div>
                            <div><label style="<?php echo $label_style; ?>">Role / Title</label><input type="text" class="tr-role" value="<?php echo esc_attr($t['role'] ?? ''); ?>" oninput="seeyamSyncTrainers();" style="<?php echo $input_style; ?>" placeholder="Chief Technical Advisor" /></div>
                            <div><label style="<?php echo $label_style; ?>">Experience</label><input type="text" class="tr-exp" value="<?php echo esc_attr($t['experience'] ?? ''); ?>" oninput="seeyamSyncTrainers();" style="<?php echo $input_style; ?>" placeholder="16+ Years Experience" /></div>
                            <div><label style="<?php echo $label_style; ?>">Avatar Image URL</label><input type="text" class="tr-avatar" value="<?php echo esc_attr($t['avatar'] ?? ''); ?>" oninput="seeyamSyncTrainers();" style="<?php echo $input_style; ?>" placeholder="https://..." /></div>
                        </div>
                        <div style="margin-bottom:10px;">
                            <label style="<?php echo $label_style; ?>">Bio / Short Description</label>
                            <textarea class="tr-bio" rows="2" oninput="seeyamSyncTrainers();" style="<?php echo $ta_style; ?>" placeholder="Ex-Amazon ML Scientist. Specializes in..."><?php echo esc_textarea($t['bio'] ?? ''); ?></textarea>
                        </div>
                        <div>
                            <label style="<?php echo $label_style; ?>">Skill Tags (Comma separated)</label>
                            <input type="text" class="tr-tags" value="<?php echo esc_attr(is_array($t['tags'] ?? null) ? implode(', ', $t['tags']) : ($t['tags'] ?? '')); ?>" oninput="seeyamSyncTrainers();" style="<?php echo $input_style; ?>" placeholder="Data Science, Python, GenAI" />
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <textarea id="seeyam_trainers_json_sync" name="seeyam_site_options[about_trainers_json]" style="display:none;"><?php echo esc_textarea(wp_json_encode($trainers)); ?></textarea>
        </div>

        <!-- ── MILESTONES BUILDER ──────────────────────────────────────────── -->
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">5. Growth Milestones Timeline</h2>
        <div style="<?php echo $section_box; ?>">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <p style="margin:0; font-size:13px; color:#475569;">Timeline milestones displayed on the About page history section. Each row: Year, Title, Description.</p>
                <button type="button" class="button button-primary" onclick="seeyamAddMilestone();" style="<?php echo $add_btn; ?>">+ Add Milestone</button>
            </div>
            <div id="seeyam-milestones-builder">
                <?php foreach ($milestones as $m): ?>
                    <div class="seeyam-milestone-row" style="<?php echo $row_style; ?>">
                        <button type="button" onclick="this.closest('.seeyam-milestone-row').remove(); seeyamSyncMilestones();" style="<?php echo $del_btn; ?>">✕ Remove</button>
                        <div style="display:grid; grid-template-columns:120px 1fr; gap:10px; padding-right:80px; margin-bottom:10px;">
                            <div><label style="<?php echo $label_style; ?>">Year</label><input type="text" class="ms-year" value="<?php echo esc_attr($m['year'] ?? ''); ?>" oninput="seeyamSyncMilestones();" style="<?php echo $input_style; ?>" placeholder="2024" /></div>
                            <div><label style="<?php echo $label_style; ?>">Milestone Title</label><input type="text" class="ms-title" value="<?php echo esc_attr($m['title'] ?? ''); ?>" oninput="seeyamSyncMilestones();" style="<?php echo $input_style; ?>" placeholder="e.g. 10,000 Graduates Placed" /></div>
                        </div>
                        <div>
                            <label style="<?php echo $label_style; ?>">Description</label>
                            <textarea class="ms-desc" rows="2" oninput="seeyamSyncMilestones();" style="<?php echo $ta_style; ?>" placeholder="Brief description of the achievement..."><?php echo esc_textarea($m['desc'] ?? ''); ?></textarea>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <textarea id="seeyam_milestones_json_sync" name="seeyam_site_options[about_milestones_json]" style="display:none;"><?php echo esc_textarea(wp_json_encode($milestones)); ?></textarea>
        </div>

        <!-- ── PILLARS BUILDER ─────────────────────────────────────────────── -->
        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">6. Why Choose Us — Advantage Pillars</h2>
        <div style="<?php echo $section_box; ?>">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <p style="margin:0; font-size:13px; color:#475569;">"Why Choose Seeyam" advantage cards on the About page. Each card: Title, Description, Color class.</p>
                <button type="button" class="button button-primary" onclick="seeyamAddPillar();" style="<?php echo $add_btn; ?>">+ Add Pillar</button>
            </div>
            <div id="seeyam-pillars-builder">
                <?php foreach ($pillars as $p): ?>
                    <div class="seeyam-pillar-row" style="<?php echo $row_style; ?>">
                        <button type="button" onclick="this.closest('.seeyam-pillar-row').remove(); seeyamSyncPillars();" style="<?php echo $del_btn; ?>">✕ Remove</button>
                        <div style="display:grid; grid-template-columns:1fr auto; gap:10px; padding-right:80px; margin-bottom:10px;">
                            <div><label style="<?php echo $label_style; ?>">Pillar Title</label><input type="text" class="pl-title" value="<?php echo esc_attr($p['title'] ?? ''); ?>" oninput="seeyamSyncPillars();" style="<?php echo $input_style; ?>" placeholder="e.g. 100% Placement Assurance" /></div>
                            <div>
                                <label style="<?php echo $label_style; ?>">Color Theme</label>
                                <select class="pl-color" onchange="seeyamSyncPillars();" style="height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px; font-size:12px;">
                                    <option value="bg-blue-50 text-blue-600"   <?php selected($p['color'] ?? '', 'bg-blue-50 text-blue-600'); ?>>🔵 Blue</option>
                                    <option value="bg-orange-50 text-orange-600" <?php selected($p['color'] ?? '', 'bg-orange-50 text-orange-600'); ?>>🟠 Orange</option>
                                    <option value="bg-indigo-50 text-indigo-600" <?php selected($p['color'] ?? '', 'bg-indigo-50 text-indigo-600'); ?>>🟣 Indigo</option>
                                    <option value="bg-emerald-50 text-emerald-600" <?php selected($p['color'] ?? '', 'bg-emerald-50 text-emerald-600'); ?>>🟢 Emerald</option>
                                    <option value="bg-rose-50 text-rose-600"   <?php selected($p['color'] ?? '', 'bg-rose-50 text-rose-600'); ?>>🔴 Rose</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style="<?php echo $label_style; ?>">Description</label>
                            <textarea class="pl-desc" rows="2" oninput="seeyamSyncPillars();" style="<?php echo $ta_style; ?>" placeholder="Describe the advantage in 1-2 sentences..."><?php echo esc_textarea($p['desc'] ?? ''); ?></textarea>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            <textarea id="seeyam_pillars_json_sync" name="seeyam_site_options[about_pillars_json]" style="display:none;"><?php echo esc_textarea(wp_json_encode($pillars)); ?></textarea>
        </div>

        <script>
        /* ── FAQ Builder ── */
        function seeyamSyncFAQs() {
            var rows = document.querySelectorAll('#seeyam-faq-builder .seeyam-faq-row');
            var items = [];
            rows.forEach(function(row) {
                var q = (row.querySelector('.faq-q') || {}).value || '';
                var a = (row.querySelector('.faq-a') || {}).value || '';
                if (q.trim()) items.push({ q: q.trim(), a: a.trim() });
            });
            document.getElementById('seeyam_faq_json_sync').value = JSON.stringify(items);
        }
        function seeyamAddFAQ() {
            var c = document.getElementById('seeyam-faq-builder');
            var d = document.createElement('div');
            d.className = 'seeyam-faq-row';
            d.style.cssText = 'background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:14px; margin-bottom:10px; position:relative;';
            d.innerHTML = '<button type="button" onclick="this.closest(\'.seeyam-faq-row\').remove(); seeyamSyncFAQs();" style="background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; position:absolute; top:14px; right:14px;">✕ Remove</button><div style="display:grid; gap:10px; padding-right:80px;"><div><label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:4px;">❓ Question</label><input type="text" class="faq-q" value="" oninput="seeyamSyncFAQs();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="e.g. Do you offer weekend batches?" /></div><div><label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:4px;">💬 Answer</label><textarea class="faq-a" rows="3" oninput="seeyamSyncFAQs();" style="width:100%; border-radius:6px; border:1px solid #cbd5e1; padding:8px; font-size:12px; box-sizing:border-box;" placeholder="Detailed answer..."></textarea></div></div>';
            c.appendChild(d);
        }

        /* ── Trainers Builder ── */
        function seeyamSyncTrainers() {
            var rows = document.querySelectorAll('#seeyam-trainers-builder .seeyam-trainer-row');
            var items = [];
            rows.forEach(function(row) {
                var name   = (row.querySelector('.tr-name')   || {}).value || '';
                var role   = (row.querySelector('.tr-role')   || {}).value || '';
                var exp    = (row.querySelector('.tr-exp')    || {}).value || '';
                var avatar = (row.querySelector('.tr-avatar') || {}).value || '';
                var bio    = (row.querySelector('.tr-bio')    || {}).value || '';
                var tagsRaw= (row.querySelector('.tr-tags')  || {}).value || '';
                var tags   = tagsRaw.split(',').map(function(t){return t.trim();}).filter(Boolean);
                if (name.trim()) items.push({ name:name.trim(), role:role.trim(), experience:exp.trim(), avatar:avatar.trim(), bio:bio.trim(), tags:tags });
            });
            document.getElementById('seeyam_trainers_json_sync').value = JSON.stringify(items);
        }
        function seeyamAddTrainer() {
            var c = document.getElementById('seeyam-trainers-builder');
            var d = document.createElement('div');
            d.className = 'seeyam-trainer-row';
            d.style.cssText = 'background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:14px; margin-bottom:10px; position:relative;';
            d.innerHTML = '<button type="button" onclick="this.closest(\'.seeyam-trainer-row\').remove(); seeyamSyncTrainers();" style="background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; position:absolute; top:14px; right:14px;">✕ Remove</button><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding-right:80px; margin-bottom:10px;"><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Full Name</label><input type="text" class="tr-name" value="" oninput="seeyamSyncTrainers();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="Dr. Ananya Sundaram" /></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Role / Title</label><input type="text" class="tr-role" value="" oninput="seeyamSyncTrainers();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="Chief Technical Advisor" /></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Experience</label><input type="text" class="tr-exp" value="" oninput="seeyamSyncTrainers();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="16+ Years Experience" /></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Avatar Image URL</label><input type="text" class="tr-avatar" value="" oninput="seeyamSyncTrainers();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="https://..." /></div></div><div style="margin-bottom:10px;"><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Bio / Short Description</label><textarea class="tr-bio" rows="2" oninput="seeyamSyncTrainers();" style="width:100%; border-radius:6px; border:1px solid #cbd5e1; padding:8px; font-size:12px; box-sizing:border-box;" placeholder="Ex-Amazon ML Scientist..."></textarea></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Skill Tags (Comma separated)</label><input type="text" class="tr-tags" value="" oninput="seeyamSyncTrainers();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="Data Science, Python, GenAI" /></div>';
            c.appendChild(d);
        }

        /* ── Milestones Builder ── */
        function seeyamSyncMilestones() {
            var rows = document.querySelectorAll('#seeyam-milestones-builder .seeyam-milestone-row');
            var items = [];
            rows.forEach(function(row) {
                var year  = (row.querySelector('.ms-year')  || {}).value || '';
                var title = (row.querySelector('.ms-title') || {}).value || '';
                var desc  = (row.querySelector('.ms-desc')  || {}).value || '';
                if (year.trim() || title.trim()) items.push({ year:year.trim(), title:title.trim(), desc:desc.trim() });
            });
            document.getElementById('seeyam_milestones_json_sync').value = JSON.stringify(items);
        }
        function seeyamAddMilestone() {
            var c = document.getElementById('seeyam-milestones-builder');
            var d = document.createElement('div');
            d.className = 'seeyam-milestone-row';
            d.style.cssText = 'background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:14px; margin-bottom:10px; position:relative;';
            d.innerHTML = '<button type="button" onclick="this.closest(\'.seeyam-milestone-row\').remove(); seeyamSyncMilestones();" style="background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; position:absolute; top:14px; right:14px;">✕ Remove</button><div style="display:grid; grid-template-columns:120px 1fr; gap:10px; padding-right:80px; margin-bottom:10px;"><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Year</label><input type="text" class="ms-year" value="" oninput="seeyamSyncMilestones();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; box-sizing:border-box;" placeholder="2024" /></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Milestone Title</label><input type="text" class="ms-title" value="" oninput="seeyamSyncMilestones();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="e.g. 10,000 Graduates Placed" /></div></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Description</label><textarea class="ms-desc" rows="2" oninput="seeyamSyncMilestones();" style="width:100%; border-radius:6px; border:1px solid #cbd5e1; padding:8px; font-size:12px; box-sizing:border-box;" placeholder="Brief description..."></textarea></div>';
            c.appendChild(d);
        }

        /* ── Pillars Builder ── */
        function seeyamSyncPillars() {
            var rows = document.querySelectorAll('#seeyam-pillars-builder .seeyam-pillar-row');
            var items = [];
            rows.forEach(function(row) {
                var title = (row.querySelector('.pl-title') || {}).value || '';
                var desc  = (row.querySelector('.pl-desc')  || {}).value || '';
                var color = (row.querySelector('.pl-color') || {}).value || 'bg-blue-50 text-blue-600';
                if (title.trim()) items.push({ title:title.trim(), desc:desc.trim(), color:color });
            });
            document.getElementById('seeyam_pillars_json_sync').value = JSON.stringify(items);
        }
        function seeyamAddPillar() {
            var c = document.getElementById('seeyam-pillars-builder');
            var d = document.createElement('div');
            d.className = 'seeyam-pillar-row';
            d.style.cssText = 'background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:14px; margin-bottom:10px; position:relative;';
            d.innerHTML = '<button type="button" onclick="this.closest(\'.seeyam-pillar-row\').remove(); seeyamSyncPillars();" style="background:#ef4444; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; position:absolute; top:14px; right:14px;">✕ Remove</button><div style="display:grid; grid-template-columns:1fr auto; gap:10px; padding-right:80px; margin-bottom:10px;"><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Pillar Title</label><input type="text" class="pl-title" value="" oninput="seeyamSyncPillars();" style="width:100%; height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 10px; font-size:13px; box-sizing:border-box;" placeholder="e.g. 100% Placement Assurance" /></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Color Theme</label><select class="pl-color" onchange="seeyamSyncPillars();" style="height:34px; border-radius:6px; border:1px solid #cbd5e1; padding:0 8px; font-size:12px;"><option value="bg-blue-50 text-blue-600">🔵 Blue</option><option value="bg-orange-50 text-orange-600">🟠 Orange</option><option value="bg-indigo-50 text-indigo-600">🟣 Indigo</option><option value="bg-emerald-50 text-emerald-600">🟢 Emerald</option><option value="bg-rose-50 text-rose-600">🔴 Rose</option></select></div></div><div><label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">Description</label><textarea class="pl-desc" rows="2" oninput="seeyamSyncPillars();" style="width:100%; border-radius:6px; border:1px solid #cbd5e1; padding:8px; font-size:12px; box-sizing:border-box;" placeholder="Describe the advantage in 1-2 sentences..."></textarea></div>';
            c.appendChild(d);
        }
        </script>
    <?php }

    private function render_advanced_tab($options) {
        $api_key = $options['api_key'] ?? '';
        ?>
        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:16px; margin-bottom:24px;">
            <h3 style="margin-top:0; color:#991b1b;">⚙️ Advanced Security & CORS Configuration</h3>
            <p style="margin-bottom:0; color:#b91c1c; font-size:13px;">These settings control cross-origin access and API authentication for the Next.js frontend integration.</p>
        </div>

        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a;">1. Cross-Origin Resource Sharing (CORS)</h2>
        <table class="form-table">
            <tr>
                <th><label style="font-weight:700;">Allowed Origin</label></th>
                <td>
                    <input type="text" name="seeyam_site_options[cors_allowed_origin]" value="<?php echo esc_attr($options['cors_allowed_origin'] ?? '*'); ?>" class="large-text" placeholder="* (allow all) or https://seeyamtechnologies.com" />
                    <p class="description">Use <code>*</code> during development. In production, set your exact frontend domain (e.g. <code>https://seeyamtechnologies.com</code>).</p>
                </td>
            </tr>
        </table>

        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">2. CRM Write API Key (X-Seeyam-Key)</h2>
        <table class="form-table">
            <tr>
                <th><label style="font-weight:700;">API Secret Key</label></th>
                <td>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" name="seeyam_site_options[api_key]" id="seeyam_api_key_field" value="<?php echo esc_attr($api_key); ?>" class="large-text" style="font-family:monospace;" placeholder="Leave blank to disable key auth (rely on WP sessions only)" />
                        <button type="button" class="button button-secondary" onclick="document.getElementById('seeyam_api_key_field').value = seeyamGenerateKey();">🔑 Generate Key</button>
                    </div>
                    <p class="description">Add this as the <code>X-Seeyam-Key: [key]</code> header in your Next.js <code>.env.local</code>. Write endpoints (lead status update, add note) require either this key OR a logged-in WordPress editor session.</p>
                </td>
            </tr>
        </table>

        <h2 style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; color:#0f172a; margin-top:30px;">3. Instant Cache Purge & On-Demand Revalidation Webhook</h2>
        <table class="form-table">
            <tr>
                <th><label style="font-weight:700;">Next.js Revalidate Webhook URL</label></th>
                <td>
                    <input type="text" name="seeyam_site_options[frontend_webhook_url]" id="seeyam_webhook_url" value="<?php echo esc_attr($options['frontend_webhook_url'] ?? 'http://localhost:3000/api/revalidate'); ?>" class="large-text" placeholder="http://localhost:3000/api/revalidate" />
                    <p class="description">Whenever you update a course, campus, review, batch, or setting, WordPress automatically fires a non-blocking webhook to this URL to purge the Next.js cache instantly.</p>
                </td>
            </tr>
            <tr>
                <th><label style="font-weight:700;">Webhook Secret Key</label></th>
                <td>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" name="seeyam_site_options[webhook_secret]" id="seeyam_webhook_secret" value="<?php echo esc_attr($options['webhook_secret'] ?? ''); ?>" class="large-text" style="font-family:monospace;" />
                        <button type="button" class="button button-secondary" onclick="testFrontendWebhook();">⚡ Test Webhook</button>
                    </div>
                    <span id="webhook_test_result" style="display:inline-block; margin-top:6px; font-weight:700; font-size:12px;"></span>
                    <p class="description">Must match <code>REVALIDATE_SECRET</code> in your Next.js <code>.env.local</code>.</p>
                </td>
            </tr>
        </table>

        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-top:20px;">
            <h4 style="margin:0 0 10px;">📋 Next.js .env.local Configuration</h4>
            <pre style="background:#1e293b; color:#94a3b8; padding:12px; border-radius:6px; font-size:12px; overflow:auto;">WORDPRESS_API_URL=http://localhost/wp-json/seeyam/v1/all-data
NEXT_PUBLIC_WP_API=http://localhost/wp-json/seeyam/v1
SEEYAM_API_KEY=<?php echo esc_html($api_key ?: 'YOUR_KEY_HERE'); ?>

REVALIDATE_SECRET=<?php echo esc_html($options['webhook_secret'] ?? ''); ?></pre>
        </div>

        <script>
        function seeyamGenerateKey() {
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var key = 'sk_seeyam_';
            for (var i = 0; i < 32; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
            return key;
        }
        function testFrontendWebhook() {
            var url = document.getElementById('seeyam_webhook_url').value;
            var secret = document.getElementById('seeyam_webhook_secret').value;
            var resultEl = document.getElementById('webhook_test_result');
            resultEl.style.color = '#2563eb';
            resultEl.innerText = 'Pinging Next.js webhook...';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-revalidate-secret': secret
                },
                body: JSON.stringify({ post_type: 'settings', action: 'test_ping' })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
                if (data && data.success) {
                    resultEl.style.color = '#16a34a';
                    resultEl.innerText = '✅ Success! Next.js revalidation webhook responded: ' + (data.message || 'OK');
                } else {
                    resultEl.style.color = '#dc2626';
                    resultEl.innerText = '❌ Error: ' + (data.message || 'Webhook rejected request.');
                }
            })
            .catch(function(err) {
                resultEl.style.color = '#dc2626';
                resultEl.innerText = '❌ Failed to reach Next.js server at ' + url + '. Is "npm run dev" running?';
            });
        }
        </script>
    <?php }

    /* -------------------------------------------------------------------------
     * 8. DEFAULT SETTINGS
     * ---------------------------------------------------------------------- */

    public function get_default_settings() {
        return [
            // Appearance
            'theme_preset'  => 'default',
            'primary_color' => '#2563eb',
            'accent_color'  => '#d4af37',
            'dark_color'    => '#071938',
            'font_family'   => 'Inter',
            'border_radius' => '24px',

            // Webhook & Security
            'frontend_webhook_url' => 'http://localhost:3000/api/revalidate',
            'webhook_secret'       => '',
            'cors_allowed_origin'  => '*',
            'api_key'              => '',

            // SEO
            'seo_site_title'    => 'Seeyam Technologies | Premier IT Training, Certification & 100% Placement Institute',
            'seo_meta_desc'     => 'Accelerate your IT career with Seeyam Technologies. Master Full Stack Java/Python, Cloud DevOps, AI & Data Science, and Software Testing with 100% placement assistance across Chennai, Bangalore & Hyderabad.',
            'seo_keywords'      => 'IT Training Institute, Full Stack Java Training, AWS DevOps Certification, Data Science AI Course, 100% Placement Guarantee',
            'seo_canonical_url' => 'http://localhost:3000',
            'seo_og_image'      => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
            'seo_twitter_handle'=> '@seeyamtech',
            'seo_ga_id'         => '',
            'seo_gtm_id'        => '',
            'seo_robots'        => 'index, follow',

            // Hero
            'hero_badge'         => 'Ranked #1 IT Training & 100% Placement Institute',
            'hero_headline'      => 'Build Your Future with Industry-Ready Tech Skills.',
            'hero_subtitle'      => 'Master Full Stack Development, Cloud DevOps, AI & Data Science, and QA Automation. Learn directly from Principal IT Architects with guaranteed placement drives.',
            'hero_val_prop_1'    => '100% Placement Record',
            'hero_val_prop_2'    => 'Real-time Enterprise Labs',
            'hero_val_prop_3'    => 'Weekday & Weekend Batches',
            'hero_youtube_url'   => 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
            'hero_video_title'   => 'Inside Seeyam Technologies — Campus Tour & Student Transformations',
            'hero_video_subtitle'=> 'Watch how our students master real-world software development, cloud infrastructure, and land top-tier tech jobs.',
            'hero_video_badge'   => 'Featured Masterclass & Tour',

            // Stats
            'stat_engineers'       => '50,000+',
            'stat_engineers_label' => 'Engineers Trained',
            'stat_branches_label'  => 'Campus Locations',
            'stat_placement'       => '100%',
            'stat_placement_label' => 'Placement Assistance',
            'stat_rating'          => '4.9★',
            'stat_rating_label'    => 'Student Rating',

            // Hiring Partners
            'hiring_network_title' => 'Top Hiring Recruiter Network:',
            'hiring_partners'      => 'Amazon, Microsoft, Google, Zoho, TCS, Infosys, Deloitte, Accenture, Cognizant',

            // Sections
            'sec_courses_badge'       => 'Trending Masterclasses',
            'sec_courses_title'       => 'Featured IT Certification Programs',
            'sec_courses_btn_text'    => 'View All Courses',
            'sec_placements_badge'    => '100% Placement Assurance',
            'sec_placements_title'    => 'Recent Alumni Success Stories',
            'sec_placements_btn_text' => 'View All Placements',
            'sec_reviews_badge'       => 'Verified Student Feedback',
            'sec_reviews_title'       => 'What Our 50,000+ Alumni Say',
            'sec_reviews_btn_text'    => 'Read All Reviews',
            'sec_branches_badge'      => 'Campuses Across South India',
            'sec_branches_title'      => 'Find Your Nearest Campus',
            'sec_branches_btn_text'   => 'View All Branches',

            // CTA
            'cta_title'    => 'Ready to Launch Your IT Career?',
            'cta_subtitle' => 'Join 50,000+ successful graduates who transformed their careers with Seeyam Technologies. Book a free 1-on-1 career counseling session today.',
            'cta_btn1_text'=> 'Explore All Courses',
            'cta_btn2_text'=> 'Book Free Counseling',

            // Brand
            'brand_name_1'  => 'SEEYAM',
            'brand_name_2'  => 'TECHNOLOGIES',
            'brand_tagline' => 'IT Training • Certification • Placement',

            // Navbar
            'navbar_badge_1'       => 'ISO 9001:2015 Certified Institute',
            'navbar_badge_2'       => 'NASSCOM Aligned Tech Curriculum',
            'navbar_badge_3'       => '100% Placement Assurance',
            'navbar_helpline_phone'=> '+91 89399 15577',

            // Footer
            'footer_about_text' => 'Empowering engineers and tech graduates with practical, production-grade IT training, masterclasses, and dedicated placement support across Chennai, Bangalore, and Hyderabad.',
            'footer_badge_1'    => 'ISO 9001:2015 Certified',
            'footer_badge_2'    => 'NASSCOM Aligned',
            'footer_phone'      => '+91 89399 15577',
            'footer_email'      => 'info@seeyamtechnologies.com',
            'footer_hours'      => 'Mon - Sun: 7:00 AM - 9:00 PM',
            'footer_copyright'  => 'Seeyam Technologies Pvt. Ltd. All rights reserved.',

            // Social
            'social_facebook'  => 'https://facebook.com/seeyamtech',
            'social_instagram' => 'https://instagram.com/seeyamtech',
            'social_linkedin'  => 'https://linkedin.com/company/seeyamtech',
            'social_youtube'   => 'https://youtube.com/@seeyamtech',
            'social_twitter'   => 'https://twitter.com/seeyamtech',

            // About page
            'about_hero_badge'    => 'Empowering Tech Careers Since 2014',
            'about_hero_title'    => 'Bridging the Gap Between Academics & Tech Industry Excellence',
            'about_hero_subtitle' => 'Seeyam Technologies was built on one fundamental promise: deliver hands-on, production-grade IT training mentored by senior corporate architects, paired with guaranteed placement drives.',
            'about_mission_title' => 'Our Core Mission',
            'about_mission_text'  => 'To transform aspiring engineers, non-IT graduates, and upskilling professionals into job-ready software developers, DevOps practitioners, and AI engineers through real-time industry projects, rigorous code reviews, and guaranteed placement drives.',
            'about_vision_title'  => 'Our Long-term Vision',
            'about_vision_text'   => 'To be India\'s premier center of excellence for emerging technologies — providing accessible, enterprise-grade education with high-compute lab infrastructure, industry-recognized global certifications, and lifelong career growth networks.',

            'about_pillars_json' => wp_json_encode([
                ['title' => '100% Placement Assurance',      'desc' => 'Dedicated corporate placement cell organizing daily interview drives, technical mocks, and resume reviews with 200+ hiring partners.',                                               'color' => 'bg-orange-50 text-orange-600'],
                ['title' => 'Corporate Architect Trainers',  'desc' => 'Learn exclusively from senior software architects and technical leads having 10+ to 16+ years of production experience in Tier-1 IT companies.',                                     'color' => 'bg-blue-50 text-blue-600'],
                ['title' => 'Live Production Projects',      'desc' => 'Work on enterprise-scale capstone projects: E-commerce microservices, AI recommendation systems, automated testing pipelines, and AWS architectures.',                               'color' => 'bg-indigo-50 text-indigo-600'],
                ['title' => 'High-Compute Cloud & GPU Labs', 'desc' => '24x7 lab access with live SAP S/4HANA servers, AWS sandbox environments, and GPU-enabled deep learning workstations.',                                                               'color' => 'bg-blue-50 text-blue-600'],
                ['title' => 'Lifetime LMS & Course Recordings','desc'=> 'Revisit class recordings, coding exercises, interview question banks, and updated course materials anytime via our student portal.',                                             'color' => 'bg-orange-50 text-orange-600'],
                ['title' => 'ISO & NASSCOM Certified',       'desc' => 'Receive globally verifiable certifications aligned with national occupational standards and recognized across top global MNCs.',                                                        'color' => 'bg-blue-50 text-blue-600'],
            ]),

            'about_trainers_json' => wp_json_encode([
                ['name' => 'Dr. Ananya Sundaram',  'role' => 'Chief Technical Advisor & AI/ML Lead',         'experience' => '16+ Years Experience', 'bio' => 'Ex-Amazon Senior ML Scientist. Specializes in Deep Learning, PyTorch, and Generative AI pipelines.',                                       'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80', 'tags' => ['Data Science', 'Python', 'GenAI']],
                ['name' => 'Rajesh Varma',         'role' => 'Director of Cloud & DevOps Architecture',      'experience' => '14+ Years Experience', 'bio' => 'Certified AWS Solutions Architect Professional & CKA. Built high-scale cloud infrastructure for fintech startups.',                    'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', 'tags' => ['AWS', 'Kubernetes', 'DevOps']],
                ['name' => 'Karthik Subramanian',  'role' => 'Principal Java & Microservices Mentor',        'experience' => '12+ Years Experience', 'bio' => 'Ex-Oracle Senior Tech Lead. Mentored 8,000+ students in Core Java, Spring Boot microservices, and Kafka.',                              'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', 'tags' => ['Java Full Stack', 'Spring Boot', 'Microservices']],
                ['name' => 'Pooja Deshmukh',       'role' => 'Lead QA Automation & SDET Architect',         'experience' => '11+ Years Experience', 'bio' => 'Deloitte Digital QA Lead alumni. Expert in Selenium, Playwright, Cypress, and Test Automation Frameworks.',                             'avatar' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80', 'tags' => ['Selenium', 'Playwright', 'API Testing']],
            ]),

            'about_milestones_json' => wp_json_encode([
                ['year' => '2014', 'title' => 'Inception in Chennai',             'desc' => 'Started with a single classroom in Navalur OMR focusing on Java and Software Testing.'],
                ['year' => '2017', 'title' => '10,000 Graduates Placed',          'desc' => 'Expanded to Vadapalani & Tambaram; partnered with 80+ IT service and product companies.'],
                ['year' => '2020', 'title' => 'Bangalore & Hyderabad Expansion',  'desc' => 'Launched state-of-the-art tech labs in Marathahalli (Bangalore) and HITEC City (Hyderabad).'],
                ['year' => '2023', 'title' => 'AI & GenAI Center of Excellence',  'desc' => 'Introduced high-compute GPU labs for Data Science, NLP, and Cloud DevOps masterclasses.'],
                ['year' => '2026', 'title' => '50,000+ Alumni Network',           'desc' => 'Recognized as South India\'s top IT training institute with 200+ active hiring partners.'],
            ]),

            'faq_items_json' => wp_json_encode([
                ['q' => 'How does Seeyam Technologies guarantee 100% placement assistance?',     'a' => 'We have an active corporate relations network of 200+ IT hiring partners. After completing your capstone projects, our placement cell conducts mock technical interviews, resume optimization, and schedules unlimited interview drives until you receive your offer letter.'],
                ['q' => 'Are the training classes conducted by real IT working professionals?',  'a' => 'Yes! 100% of our trainers are active Principal Technical Architects, DevOps leads, and Full Stack consultants with 10+ to 16+ years of real production experience in Tier-1 IT companies.'],
                ['q' => 'Can I attend a free demo class before enrolling?',                      'a' => 'Absolutely! We offer free 1-on-1 career consultation and live classroom demo sessions across all our campuses and online. You can interact directly with the trainer before making any payment.'],
                ['q' => 'Do you offer weekend batches for working professionals?',               'a' => 'Yes, we provide flexible Weekend batches (Saturday & Sunday 3-4 hours each) as well as Fast-Track weekday morning and evening batches.'],
                ['q' => 'Is there an EMI or installment option for course fees?',                'a' => 'Yes, we offer 0% interest EMI options through major credit cards as well as 2 to 3 flexible fee installment options. Talk to your counselor for details.'],
            ]),

            // Scroll Animation (GSAP Primary)

            // Scroll Animation 2 (GSAP Secondary)

            // Advanced / Security
            'cors_allowed_origin' => '*',
            'api_key'             => '',
        ];
    }

    /* -------------------------------------------------------------------------
     * 9. REST API ENDPOINTS
     * ---------------------------------------------------------------------- */

    public function register_rest_routes() {
        $ns = 'seeyam/v1';

        // Public read endpoints
        register_rest_route($ns, '/all-data', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_all_platform_data'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns, '/site-settings', [
            'methods'             => 'GET',
            'callback'            => [$this, 'get_site_settings'],
            'permission_callback' => '__return_true',
        ]);

        // Lead: create (public — honeypot protected) & list (auth)
        register_rest_route($ns, '/leads', [
            [
                'methods'             => 'POST',
                'callback'            => [$this, 'api_create_lead'],
                'permission_callback' => '__return_true',
            ],
            [
                'methods'             => 'GET',
                'callback'            => [$this, 'api_get_leads'],
                'permission_callback' => [$this, 'check_api_auth'],
            ],
        ]);

        // Lead: update status (auth required)
        register_rest_route($ns, '/leads/(?P<id>[a-zA-Z0-9_-]+)/status', [
            'methods'             => 'POST',
            'callback'            => [$this, 'api_update_lead_status'],
            'permission_callback' => [$this, 'check_api_auth'],
        ]);

        // Lead: add note (auth required)
        register_rest_route($ns, '/leads/(?P<id>[a-zA-Z0-9_-]+)/note', [
            'methods'             => 'POST',
            'callback'            => [$this, 'api_add_lead_note'],
            'permission_callback' => [$this, 'check_api_auth'],
        ]);

        // Lead: CSV export (auth required)
        register_rest_route($ns, '/leads/export', [
            'methods'             => 'GET',
            'callback'            => [$this, 'api_export_leads_csv'],
            'permission_callback' => [$this, 'check_api_auth'],
        ]);

        // Seed data (dev utility)
        register_rest_route($ns, '/seed', [
            'methods'             => ['GET', 'POST'],
            'callback'            => [$this, 'seed_data_endpoint'],
            'permission_callback' => '__return_true',
        ]);
    }

    public function get_site_settings($request) {
        $saved  = get_option('seeyam_site_options', []);
        $merged = wp_parse_args(is_array($saved) ? $saved : [], $this->get_default_settings());
        return rest_ensure_response($this->remove_retired_scroll_settings($merged));
    }

    public function remove_retired_scroll_settings($settings) {
        if (!is_array($settings)) return $settings;
        foreach (array_keys($settings) as $key) {
            if (strpos($key, 'scroll_anim') === 0) unset($settings[$key]);
        }
        return $settings;
    }

    /**
     * POST /seeyam/v1/leads
     * Public endpoint with honeypot + validation.
     */
    public function api_create_lead($request) {
        $params = $request->get_json_params() ?: $request->get_body_params();

        // ── Honeypot: if bot fills 'website' field, fake success and bail
        if (!empty($params['website'])) {
            return rest_ensure_response(['success' => true, 'message' => 'Lead registered.']);
        }

        $name      = sanitize_text_field($params['fullName']    ?? $params['student_name'] ?? '');
        $email     = sanitize_email($params['email']            ?? $params['student_email'] ?? '');
        $phone     = sanitize_text_field($params['phone']       ?? $params['student_phone'] ?? '');
        $course_id = sanitize_text_field($params['courseId']    ?? $params['course_id'] ?? 'course-mern');
        $branch_id = sanitize_text_field($params['branchId']    ?? $params['branch_id'] ?? 'branch-omr');
        $source    = sanitize_text_field($params['source']      ?? 'Website Inquiry Modal');
        $note      = sanitize_text_field($params['initialNote'] ?? 'Online lead submitted via website form.');

        // ── Validation
        if (empty($name)) {
            return new WP_Error('validation_error', 'Full name is required.', ['status' => 422]);
        }
        if (empty($phone) && empty($email)) {
            return new WP_Error('validation_error', 'At least one of phone or email is required.', ['status' => 422]);
        }
        if (!empty($email) && !is_email($email)) {
            return new WP_Error('validation_error', 'Invalid email address format.', ['status' => 422]);
        }

        $post_id = wp_insert_post([
            'post_title'  => $name . ' (' . ($phone ?: $email) . ')',
            'post_type'   => 'lead',
            'post_status' => 'publish',
        ]);

        if (is_wp_error($post_id)) {
            return new WP_Error('lead_create_error', 'Failed to save lead.', ['status' => 500]);
        }

        $notes = [['id' => 'note-' . time(), 'timestamp' => current_time('mysql'), 'text' => $note, 'author' => 'System / Online Form']];

        update_post_meta($post_id, 'student_name',  $name);
        update_post_meta($post_id, 'student_email', $email);
        update_post_meta($post_id, 'student_phone', $phone);
        update_post_meta($post_id, 'course_id',     $course_id);
        update_post_meta($post_id, 'branch_id',     $branch_id);
        update_post_meta($post_id, 'lead_status',   'NEW');
        update_post_meta($post_id, 'source',        $source);
        update_post_meta($post_id, 'notes_json',    wp_json_encode($notes));

        delete_transient(self::CACHE_KEY);

        return rest_ensure_response([
            'success' => true,
            'message' => 'Lead registered successfully!',
            'lead'    => [
                'id'        => 'lead-' . $post_id,
                'fullName'  => $name,
                'email'     => $email,
                'phone'     => $phone,
                'courseId'  => $course_id,
                'branchId'  => $branch_id,
                'status'    => 'NEW',
                'source'    => $source,
                'createdAt' => get_the_date('c', $post_id),
                'notes'     => $notes,
            ],
        ]);
    }

    public function api_get_leads($request) {
        $query = new WP_Query(['post_type' => 'lead', 'posts_per_page' => -1, 'post_status' => 'publish']);
        $leads = [];
        foreach ($query->posts as $post) {
            $notes_raw = get_post_meta($post->ID, 'notes_json', true);
            $notes = is_string($notes_raw) ? (json_decode($notes_raw, true) ?: []) : ($notes_raw ?: []);
            $leads[] = [
                'id'        => 'lead-' . $post->ID,
                'fullName'  => get_post_meta($post->ID, 'student_name',  true) ?: $post->post_title,
                'email'     => get_post_meta($post->ID, 'student_email', true) ?: '',
                'phone'     => get_post_meta($post->ID, 'student_phone', true) ?: '',
                'courseId'  => get_post_meta($post->ID, 'course_id',    true) ?: 'course-mern',
                'branchId'  => get_post_meta($post->ID, 'branch_id',    true) ?: 'branch-omr',
                'status'    => get_post_meta($post->ID, 'lead_status',   true) ?: 'NEW',
                'source'    => get_post_meta($post->ID, 'source',        true) ?: 'Website',
                'createdAt' => get_the_date('c', $post),
                'updatedAt' => get_the_modified_date('c', $post),
                'notes'     => $notes,
            ];
        }
        return rest_ensure_response(['success' => true, 'leads' => $leads]);
    }

    public function api_update_lead_status($request) {
        $post_id    = intval(str_replace('lead-', '', $request->get_param('id')));
        $params     = $request->get_json_params();
        $new_status = sanitize_text_field($params['status'] ?? $params['newStatus'] ?? 'CONTACTED');
        $note_text  = sanitize_text_field($params['note']   ?? '');
        $author     = sanitize_text_field($params['author'] ?? 'Counselor');

        if (!$post_id || get_post_type($post_id) !== 'lead') {
            return new WP_Error('not_found', 'Lead not found.', ['status' => 404]);
        }
        if (!in_array($new_status, self::LEAD_STATUSES, true)) {
            return new WP_Error('invalid_status', 'Invalid status value. Must be one of: ' . implode(', ', self::LEAD_STATUSES), ['status' => 422]);
        }

        update_post_meta($post_id, 'lead_status', $new_status);

        if ($note_text) {
            $raw   = get_post_meta($post_id, 'notes_json', true);
            $notes = is_string($raw) ? (json_decode($raw, true) ?: []) : ($raw ?: []);
            array_unshift($notes, ['id' => 'note-' . time(), 'timestamp' => current_time('mysql'), 'text' => $note_text, 'author' => $author]);
            update_post_meta($post_id, 'notes_json', wp_json_encode($notes));
        }

        delete_transient(self::CACHE_KEY);
        return rest_ensure_response(['success' => true, 'status' => $new_status]);
    }

    public function api_add_lead_note($request) {
        $post_id = intval(str_replace('lead-', '', $request->get_param('id')));
        $params  = $request->get_json_params();
        $text    = sanitize_text_field($params['text']   ?? '');
        $author  = sanitize_text_field($params['author'] ?? 'Counselor');

        if (!$post_id || get_post_type($post_id) !== 'lead') {
            return new WP_Error('not_found', 'Lead not found.', ['status' => 404]);
        }
        if (empty($text)) {
            return new WP_Error('validation_error', 'Note text cannot be empty.', ['status' => 422]);
        }

        $raw   = get_post_meta($post_id, 'notes_json', true);
        $notes = is_string($raw) ? (json_decode($raw, true) ?: []) : ($raw ?: []);
        array_unshift($notes, ['id' => 'note-' . time(), 'timestamp' => current_time('mysql'), 'text' => $text, 'author' => $author]);
        update_post_meta($post_id, 'notes_json', wp_json_encode($notes));

        delete_transient(self::CACHE_KEY);
        return rest_ensure_response(['success' => true, 'notes' => $notes]);
    }

    /**
     * GET /seeyam/v1/leads/export — CSV download (auth required)
     */
    public function api_export_leads_csv($request) {
        $query = new WP_Query(['post_type' => 'lead', 'posts_per_page' => -1, 'post_status' => 'publish']);

        $filename = 'seeyam-leads-' . date('Y-m-d') . '.csv';
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: no-store, no-cache');

        $out = fopen('php://output', 'w');
        fputcsv($out, ['ID', 'Full Name', 'Email', 'Phone', 'Course', 'Branch', 'Status', 'Source', 'Created At', 'Notes Count']);

        foreach ($query->posts as $post) {
            $notes_raw = get_post_meta($post->ID, 'notes_json', true);
            $notes = is_string($notes_raw) ? (json_decode($notes_raw, true) ?: []) : ($notes_raw ?: []);
            fputcsv($out, [
                'lead-' . $post->ID,
                get_post_meta($post->ID, 'student_name',  true) ?: $post->post_title,
                get_post_meta($post->ID, 'student_email', true) ?: '',
                get_post_meta($post->ID, 'student_phone', true) ?: '',
                get_post_meta($post->ID, 'course_id',     true) ?: '',
                get_post_meta($post->ID, 'branch_id',     true) ?: '',
                get_post_meta($post->ID, 'lead_status',   true) ?: 'NEW',
                get_post_meta($post->ID, 'source',        true) ?: '',
                get_the_date('Y-m-d H:i:s', $post),
                count($notes),
            ]);
        }
        fclose($out);
        exit;
    }

    /**
     * GET /seeyam/v1/all-data — Main aggregated payload with 30s transient cache.
     */
    public function get_all_platform_data($request) {
        $cached = get_transient(self::CACHE_KEY);
        if ($cached !== false) {
            return rest_ensure_response($cached);
        }

        // Categories
        $categories = [];
        $cat_terms  = get_terms(['taxonomy' => 'course_category', 'hide_empty' => false]);
        if (!is_wp_error($cat_terms)) {
            foreach ($cat_terms as $t) {
                $custom_id = get_term_meta($t->term_id, 'custom_id', true);
                $categories[] = [
                    'id'          => $custom_id ?: ('cat-' . $t->slug),
                    'name'        => $t->name,
                    'slug'        => $t->slug,
                    'description' => $t->description ?: '',
                ];
            }
        }

        // Courses
        $courses = [];
        foreach ((new WP_Query(['post_type' => 'course', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $cat_terms = wp_get_post_terms($post->ID, 'course_category');
            $cat_id    = (!empty($cat_terms) && !is_wp_error($cat_terms))
                ? (get_term_meta($cat_terms[0]->term_id, 'custom_id', true) ?: ('cat-' . $cat_terms[0]->slug))
                : 'cat-bi';
            $h_raw     = get_post_meta($post->ID, 'highlights', true);
            $s_raw     = get_post_meta($post->ID, 'syllabus', true);
            $hp_raw    = get_post_meta($post->ID, 'hiring_partners', true) ?: 'Amazon, Microsoft, Google, Zoho, TCS, Infosys, Cognizant';

            $highlights      = is_string($h_raw)  ? (json_decode($h_raw, true)  ?: array_values(array_filter(array_map('trim', explode("\n", $h_raw))))) : ($h_raw ?: []);
            $syllabus        = is_string($s_raw)  ? (json_decode($s_raw, true)  ?: []) : ($s_raw ?: []);
            $hiring_partners = is_string($hp_raw) ? (json_decode($hp_raw, true) ?: array_values(array_filter(array_map('trim', explode(',', $hp_raw))))) : ($hp_raw ?: []);

            $custom_course_id = get_post_meta($post->ID, 'custom_id', true);
            $courses[] = [
                'id'             => $custom_course_id ?: ('course-' . $post->post_name),
                'title'          => $post->post_title,
                'slug'           => $post->post_name,
                'categoryId'     => $cat_id,
                'summary'        => get_post_meta($post->ID, 'summary', true) ?: $post->post_excerpt,
                'duration'       => get_post_meta($post->ID, 'duration', true) ?: '4 Months',
                'mode'           => get_post_meta($post->ID, 'mode', true) ?: 'HYBRID',
                'price'          => (int)(get_post_meta($post->ID, 'price', true) ?: 38000),
                'expectedSalary' => get_post_meta($post->ID, 'expected_salary', true) ?: '₹ 6.0 - 15.0 LPA',
                'rating'         => (float)(get_post_meta($post->ID, 'rating', true) ?: 4.9),
                'enrolledCount'  => (int)(get_post_meta($post->ID, 'enrolled_count', true) ?: 10000),
                'isFeatured'     => (bool)get_post_meta($post->ID, 'is_featured', true),
                'highlights'     => $highlights,
                'syllabus'       => $syllabus,
                'brochureUrl'    => get_post_meta($post->ID, 'brochure_pdf_url', true) ?: '',
                'hiringPartners' => $hiring_partners,
                'seoTitle'       => get_post_meta($post->ID, 'seo_title', true) ?: '',
                'seoDescription' => get_post_meta($post->ID, 'seo_description', true) ?: '',
            ];
        }

        // Branches
        $branches = [];
        foreach ((new WP_Query(['post_type' => 'branch', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $branches[] = [
                'id'          => 'branch-' . $post->post_name,
                'name'        => $post->post_title,
                'slug'        => $post->post_name,
                'address'     => get_post_meta($post->ID, 'address',       true) ?: '',
                'city'        => get_post_meta($post->ID, 'city',          true) ?: 'Chennai',
                'phone'       => get_post_meta($post->ID, 'phone',         true) ?: '+91 89399 15577',
                'whatsapp'    => get_post_meta($post->ID, 'whatsapp',      true) ?: '+918939915577',
                'email'       => get_post_meta($post->ID, 'email',         true) ?: 'info@seeyamtechnologies.com',
                'timing'      => get_post_meta($post->ID, 'timing',        true) ?: 'Mon - Sun: 7:00 AM - 9:00 PM',
                'landmark'    => get_post_meta($post->ID, 'landmark',      true) ?: '',
                'mapEmbedUrl' => get_post_meta($post->ID, 'map_embed_url', true) ?: '',
            ];
        }

        // Leads (recent 50)
        $leads = [];
        foreach ((new WP_Query(['post_type' => 'lead', 'posts_per_page' => 50, 'post_status' => 'publish']))->posts as $post) {
            $nr = get_post_meta($post->ID, 'notes_json', true);
            $leads[] = [
                'id'        => 'lead-' . $post->ID,
                'fullName'  => get_post_meta($post->ID, 'student_name',  true) ?: $post->post_title,
                'email'     => get_post_meta($post->ID, 'student_email', true) ?: '',
                'phone'     => get_post_meta($post->ID, 'student_phone', true) ?: '',
                'courseId'  => get_post_meta($post->ID, 'course_id',    true) ?: 'course-mern',
                'branchId'  => get_post_meta($post->ID, 'branch_id',    true) ?: 'branch-omr',
                'status'    => get_post_meta($post->ID, 'lead_status',   true) ?: 'NEW',
                'source'    => get_post_meta($post->ID, 'source',        true) ?: 'Website',
                'createdAt' => get_the_date('c', $post),
                'updatedAt' => get_the_modified_date('c', $post),
                'notes'     => is_string($nr) ? (json_decode($nr, true) ?: []) : ($nr ?: []),
            ];
        }

        // Placements
        $placements = [];
        foreach ((new WP_Query(['post_type' => 'placement', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $placements[] = [
                'id'               => 'plc-' . $post->ID,
                'studentName'      => get_post_meta($post->ID, 'student_name',      true) ?: $post->post_title,
                'companyName'      => get_post_meta($post->ID, 'company_name',      true) ?: 'Tech Corp',
                'role'             => get_post_meta($post->ID, 'role',              true) ?: 'Software Engineer',
                'packageCtc'       => get_post_meta($post->ID, 'package_ctc',       true) ?: '12.0 LPA',
                'studentAvatarUrl' => get_post_meta($post->ID, 'student_avatar_url',true) ?: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                'courseId'         => get_post_meta($post->ID, 'course_id',         true) ?: 'course-mern',
                'branchId'         => get_post_meta($post->ID, 'branch_id',         true) ?: 'branch-omr',
                'quote'            => get_post_meta($post->ID, 'quote',             true) ?: '',
            ];
        }

        // Reviews
        $reviews = [];
        foreach ((new WP_Query(['post_type' => 'review', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $reviews[] = [
                'id'             => 'rev-' . $post->ID,
                'studentName'    => get_post_meta($post->ID, 'student_name',   true) ?: $post->post_title,
                'studentEmail'   => get_post_meta($post->ID, 'student_email',  true) ?: '',
                'courseId'       => get_post_meta($post->ID, 'course_id',      true) ?: 'course-mern',
                'branchId'       => get_post_meta($post->ID, 'branch_id',      true) ?: 'branch-omr',
                'rating'         => (int)(get_post_meta($post->ID, 'rating',   true) ?: 5),
                'title'          => $post->post_title,
                'body'           => $post->post_content,
                'completionYear' => get_post_meta($post->ID, 'completion_year', true) ?: '2026',
                'status'         => get_post_meta($post->ID, 'review_status',   true) ?: 'APPROVED',
                'createdAt'      => get_the_date('c', $post),
                'updatedAt'      => get_the_modified_date('c', $post),
            ];
        }

        // Batches
        $batches = [];
        foreach ((new WP_Query(['post_type' => 'batch', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $batches[] = [
                'id'             => 'batch-' . $post->ID,
                'courseId'       => get_post_meta($post->ID, 'course_id',       true) ?: 'course-mern',
                'branchId'       => get_post_meta($post->ID, 'branch_id',       true) ?: 'branch-omr',
                'instructorName' => get_post_meta($post->ID, 'instructor_name', true) ?: 'Senior Tech Mentor',
                'instructorExp'  => get_post_meta($post->ID, 'instructor_exp',  true) ?: '12+ Yrs Exp',
                'startDate'      => get_post_meta($post->ID, 'start_date',      true) ?: date('Y-m-d'),
                'timing'         => get_post_meta($post->ID, 'timing',          true) ?: 'Mon - Fri: 7:30 AM - 9:30 AM',
                'maxSeats'       => (int)(get_post_meta($post->ID, 'max_seats',   true) ?: 30),
                'seatsLeft'      => (int)(get_post_meta($post->ID, 'seats_left',  true) ?: 5),
                'status'         => get_post_meta($post->ID, 'batch_status',    true) ?: 'UPCOMING',
            ];
        }

        // FAQs
        $faqs = [];
        foreach ((new WP_Query(['post_type' => 'seeyam_faq', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $faqs[] = [
                'id'        => 'faq-' . $post->ID,
                'question'  => $post->post_title,
                'answer'    => $post->post_content,
                'courseId'  => get_post_meta($post->ID, 'course_id', true) ?: null,
                'category'  => get_post_meta($post->ID, 'faq_category', true) ?: 'general',
                'order'     => (int)(get_post_meta($post->ID, 'order_num', true) ?: $post->menu_order),
                'createdAt' => get_the_date('c', $post),
            ];
        }

        // Interview Questions
        $interviewQuestions = [];
        foreach ((new WP_Query(['post_type' => 'seeyam_interview_question', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $interviewQuestions[] = [
                'id'        => 'iq-' . $post->ID,
                'courseId'  => get_post_meta($post->ID, 'course_id', true) ?: 'course-mern',
                'question'  => $post->post_title,
                'answer'    => get_post_meta($post->ID, 'answer', true) ?: $post->post_content,
                'category'  => get_post_meta($post->ID, 'category', true) ?: 'SQL',
                'order'     => (int)(get_post_meta($post->ID, 'order_num', true) ?: $post->menu_order),
                'createdAt' => get_the_date('c', $post),
            ];
        }

        // Downloadable Resources
        $resources = [];
        foreach ((new WP_Query(['post_type' => 'seeyam_resource', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $resources[] = [
                'id'          => 'res-' . $post->ID,
                'title'       => $post->post_title,
                'type'        => get_post_meta($post->ID, 'resource_type', true) ?: 'RESUME_TEMPLATE',
                'fileUrl'     => get_post_meta($post->ID, 'file_url', true) ?: '',
                'courseId'    => get_post_meta($post->ID, 'course_id', true) ?: null,
                'fileSize'    => get_post_meta($post->ID, 'file_size', true) ?: '1.2 MB',
                'category'    => get_post_meta($post->ID, 'category', true) ?: 'General',
                'description' => $post->post_content,
                'createdAt'   => get_the_date('c', $post),
            ];
        }

        // Job Portal Links
        $jobPortalLinks = [];
        foreach ((new WP_Query(['post_type' => 'seeyam_job_portal_link', 'posts_per_page' => -1, 'post_status' => 'publish']))->posts as $post) {
            $jobPortalLinks[] = [
                'id'         => 'job-' . $post->ID,
                'siteName'   => get_post_meta($post->ID, 'site_name', true) ?: $post->post_title,
                'url'        => get_post_meta($post->ID, 'url', true) ?: 'https://linkedin.com',
                'roleFilter' => get_post_meta($post->ID, 'role_filter', true) ?: 'data-analyst',
                'badge'      => get_post_meta($post->ID, 'badge', true) ?: 'Active Roles',
                'order'      => (int)(get_post_meta($post->ID, 'order_num', true) ?: $post->menu_order),
                'createdAt'  => get_the_date('c', $post),
            ];
        }

        // Site Settings
        $saved    = get_option('seeyam_site_options', []);
        $settings = wp_parse_args(is_array($saved) ? $saved : [], $this->get_default_settings());
        $settings = $this->remove_retired_scroll_settings($settings);

        $response = [
            'success' => true,
            'data'    => compact('categories', 'courses', 'branches', 'leads', 'placements', 'reviews', 'batches', 'faqs', 'interviewQuestions', 'resources', 'jobPortalLinks', 'settings'),
        ];

        set_transient(self::CACHE_KEY, $response, self::CACHE_TTL);
        return rest_ensure_response($response);
    }

    /* -------------------------------------------------------------------------
     * 10. SEEDER
     * ---------------------------------------------------------------------- */

    public function handle_manual_seed() {
        if (!current_user_can('manage_options')) wp_die('Unauthorized');
        check_admin_referer('seeyam_seed_action', 'seeyam_seed_nonce');
        $this->seed_all_content();
        delete_transient(self::CACHE_KEY);
        wp_redirect(admin_url('admin.php?page=seeyam-settings&seeded=1'));
        exit;
    }

    public function seed_data_endpoint() {
        $this->seed_all_content();
        delete_transient(self::CACHE_KEY);
        return rest_ensure_response(['success' => true, 'message' => 'All content seeded successfully.']);
    }

    public function seed_all_content() {
        // 0. PURGE ALL PRELOADED / EXISTING NON-ANALYTICS CONTENT
        // Delete all courses
        $existing_courses = get_posts(['post_type' => 'course', 'posts_per_page' => -1, 'post_status' => 'any']);
        foreach ($existing_courses as $p) {
            wp_delete_post($p->ID, true);
        }

        // Delete all batches
        $existing_batches = get_posts(['post_type' => 'batch', 'posts_per_page' => -1, 'post_status' => 'any']);
        foreach ($existing_batches as $p) {
            wp_delete_post($p->ID, true);
        }

        // Delete all placements
        $existing_placements = get_posts(['post_type' => 'placement', 'posts_per_page' => -1, 'post_status' => 'any']);
        foreach ($existing_placements as $p) {
            wp_delete_post($p->ID, true);
        }

        // Delete all reviews
        $existing_reviews = get_posts(['post_type' => 'review', 'posts_per_page' => -1, 'post_status' => 'any']);
        foreach ($existing_reviews as $p) {
            wp_delete_post($p->ID, true);
        }

        // Delete all existing course categories
        $existing_terms = get_terms(['taxonomy' => 'course_category', 'hide_empty' => false]);
        if (!is_wp_error($existing_terms)) {
            foreach ($existing_terms as $t) {
                wp_delete_term($t->term_id, 'course_category');
            }
        }

        // 1. Course Categories (Data Analytics & Business Intelligence)
        $categories = [
            ['Business Intelligence & Visualization', 'business-intelligence-visualization', 'cat-bi',       'Master Power BI, Tableau Desktop & Server, interactive dashboard architecture, and executive storytelling.'],
            ['SQL & Data Engineering',                'sql-data-engineering',                'cat-sql',      'Advanced SQL, PostgreSQL, Snowflake Cloud Data Warehousing, schema optimization, and ETL data pipelines.'],
            ['Python for Analytics & AI',             'python-for-analytics-ai',             'cat-python',   'Data manipulation with Pandas, statistical computing with NumPy, EDA, Seaborn, and Streamlit analytics apps.'],
            ['Business & Product Analytics',          'business-product-analytics',          'cat-business', 'KPI frameworks, Cohort analysis, Funnel optimization, A/B testing methodologies, Jira, and Agile business analysis.'],
            ['Advanced Excel & Financial Modeling',   'advanced-excel-financial-modeling',   'cat-excel',    'Power Query, Advanced Dynamic Formulas, Financial Statements Modeling, DCF valuation, and VBA macros.'],
            ['Digital Marketing & Growth Analytics',  'digital-marketing-growth-analytics',  'cat-marketing','GA4 measurement protocols, Meta Ads attribution, CAC/LTV forecasting, and performance growth analytics.'],
        ];
        foreach ($categories as [$name, $slug, $custom_id, $desc]) {
            $t = wp_insert_term($name, 'course_category', ['slug' => $slug, 'description' => $desc]);
            if (!is_wp_error($t) && isset($t['term_id'])) {
                update_term_meta($t['term_id'], 'custom_id', $custom_id);
            }
        }

        // 2. Branches
        $branches_data = [
            ['OMR - Navalur (HQ)',       'omr-navalur',          'Plot No. 42, Rajiv Gandhi Salai (OMR), Navalur, Near AGS Cinemas',          'Chennai',   '+91 89399 15577', '+918939915577', 'omr@seeyamtechnologies.com',         'Mon - Sun: 7:00 AM - 9:00 PM', 'Opposite to Vivira Mall',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.31289182377!2d80.2257!3d12.8436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUwJzM2LjkiTiA4MMKwMTMnMzIuNSJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'],
            ['Vadapalani',               'vadapalani',           '2nd Floor, Arcot Road, Next to Forum Vijaya Mall, Vadapalani',                'Chennai',   '+91 89399 25588', '+918939925588', 'vadapalani@seeyamtechnologies.com',  'Mon - Sun: 7:00 AM - 9:00 PM', 'Next to Forum Vijaya Mall',   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8!2d80.209!3d13.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAzJzAwLjAiTiA4MMKwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'],
            ['Tambaram Sanatorium',      'tambaram-sanatorium',  'GST Road, Near MEPZ Main Gate, Tambaram Sanatorium',                        'Chennai',   '+91 89399 35599', '+918939935599', 'tambaram@seeyamtechnologies.com',    'Mon - Sun: 7:00 AM - 9:00 PM', 'Opposite to MEPZ',            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d80.125!3d12.925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzMwLjAiTiA4MMKwMDcnMzAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'],
            ['Marathahalli',             'marathahalli',         'Outer Ring Road, Near Innovative Multiplex, Marathahalli',                   'Bangalore', '+91 99000 45511', '+919900045511', 'bangalore@seeyamtechnologies.com',   'Mon - Sun: 7:00 AM - 9:00 PM', 'Near Marathahalli Bridge',    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9!2d77.70!3d12.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU3JzAwLjAiTiA3N8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'],
            ['HITEC City - Madhapur',    'hitec-city',           'Image Gardens Road, VIP Hills, Madhapur, Near Cyber Towers',                 'Hyderabad', '+91 98888 65522', '+919888865522', 'hyderabad@seeyamtechnologies.com',   'Mon - Sun: 7:00 AM - 9:00 PM', 'Near Cyber Towers',           'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2!2d78.38!3d17.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzI0LjAiTiA3OMKwMjInNDguMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin'],
        ];
        foreach ($branches_data as [$title, $slug, $address, $city, $phone, $whatsapp, $email, $timing, $landmark, $map]) {
            $existing = get_page_by_path($slug, OBJECT, 'branch');
            $pid      = $existing ? $existing->ID : wp_insert_post(['post_title' => $title, 'post_name' => $slug, 'post_type' => 'branch', 'post_status' => 'publish']);
            if ($pid && !is_wp_error($pid)) {
                update_post_meta($pid, 'address',       $address);
                update_post_meta($pid, 'city',          $city);
                update_post_meta($pid, 'phone',         $phone);
                update_post_meta($pid, 'whatsapp',      $whatsapp);
                update_post_meta($pid, 'email',         $email);
                update_post_meta($pid, 'timing',        $timing);
                update_post_meta($pid, 'landmark',      $landmark);
                update_post_meta($pid, 'map_embed_url', $map);
            }
        }

        // 3. Courses (Data Analytics & Business Intelligence)
        $courses_data = [
            [
                'id'          => 'course-da-mastery',
                'title'       => 'Data Analytics Master Program (Power BI, SQL, Python, Excel & Tableau)',
                'slug'        => 'data-analytics-master-program',
                'cat'         => 'business-intelligence-visualization',
                'summary'     => 'Comprehensive flagship certification covering end-to-end data analytics: Power BI, Advanced SQL, Python (Pandas/NumPy), Tableau, and Advanced Excel with 8 live enterprise capstone projects.',
                'duration'    => '4 Months / 120 Hours',
                'mode'        => 'HYBRID',
                'price'       => 38000,
                'salary'      => '₹ 5.5 - 14.5 LPA',
                'rating'      => 4.95,
                'enrolled'    => 18400,
                'featured'    => 1,
                'partners'    => 'Amazon, Google, Microsoft, Zoho, Deloitte, Accenture',
                'highlights'  => wp_json_encode([
                    '100% Placement Assurance with Tier-1 MNC Recruitment',
                    'End-to-End Analytics Stack: Power BI, SQL, Python & Tableau',
                    '8 Real-world Enterprise Dashboards & Portfolios',
                    'Microsoft PL-300 & Tableau Certified Data Analyst Prep',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Advanced Excel & Business Modeling', 'duration' => '3 Weeks', 'topics' => ['Advanced XLOOKUP & Dynamic Arrays', 'Power Query ETL & Data Modeling', 'Pivot Charts & Slicers', 'Financial Modeling & Sensitivity Analysis']],
                    ['title' => 'Module 2: Relational Databases & SQL for Analytics', 'duration' => '3 Weeks', 'topics' => ['DDL, DML & Schema Design', 'Complex Joins & Aggregations', 'Window Functions (RANK, DENSE_RANK, LEAD/LAG)', 'Subqueries, CTEs & Query Optimization']],
                    ['title' => 'Module 3: Power BI Business Intelligence', 'duration' => '4 Weeks', 'topics' => ['Star-Schema Data Modeling', 'DAX Formulas & Time Intelligence', 'Power BI Service & Workspace Governance', 'Row-Level Security (RLS) & Scheduled Refresh']],
                    ['title' => 'Module 4: Tableau Visual Analytics & Storytelling', 'duration' => '3 Weeks', 'topics' => ['LOD Expressions & Parameters', 'Dual-axis & Geographic Visuals', 'Executive Storyboards & Layouts', 'Tableau Server Publishing & Permissions']],
                    ['title' => 'Module 5: Python for Data Analytics & EDA', 'duration' => '3 Weeks', 'topics' => ['NumPy & Pandas Data Wrangling', 'Matplotlib & Seaborn Visualizations', 'Exploratory Data Analysis on 100k+ Records', 'Capstone Business Presentation']],
                ]),
            ],
            [
                'id'          => 'course-power-bi',
                'title'       => 'Power BI & Business Intelligence Masterclass (DAX, Power Query & Fabric)',
                'slug'        => 'power-bi-business-intelligence-masterclass',
                'cat'         => 'business-intelligence-visualization',
                'summary'     => 'Industry-aligned Power BI curriculum: Power Query M-code, complex DAX time intelligence, star-schema data modeling, row-level security, and Microsoft Fabric integration.',
                'duration'    => '2.5 Months / 70 Hours',
                'mode'        => 'HYBRID',
                'price'       => 26000,
                'salary'      => '₹ 6.0 - 15.0 LPA',
                'rating'      => 4.92,
                'enrolled'    => 12400,
                'featured'    => 1,
                'partners'    => 'Microsoft, EY, PwC, Infosys, Wipro, Cognizant',
                'highlights'  => wp_json_encode([
                    'Official PL-300 Microsoft Power BI Data Analyst Exam Prep',
                    'Deep-dive DAX & Star Schema Data Modeling',
                    'Row-Level Security & Power BI Service Administration',
                    'Microsoft Fabric Lakehouse Analytics Integration',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Power Query & Advanced Data Extraction', 'duration' => '2 Weeks', 'topics' => ['Connecting to Multiple Sources (SQL, Web, Excel)', 'M-Code Fundamentals', 'Merging, Appending & Transforming Queries', 'Handling Dirty Real-World Data']],
                    ['title' => 'Module 2: Enterprise Data Modeling & Star Schema', 'duration' => '2 Weeks', 'topics' => ['Star Schema vs Snowflake Schema', 'Fact & Dimension Relationships', 'Active vs Inactive Relationships', 'Bridge Tables & Many-to-Many Handling']],
                    ['title' => 'Module 3: Advanced DAX (Data Analysis Expressions)', 'duration' => '3 Weeks', 'topics' => ['Row Context vs Filter Context', 'CALCULATE & Filter Modifiers (ALL, ALLEXCEPT, KEEPFILTERS)', 'Time Intelligence Functions (YTD, QTD, SAMEPERIODLASTYEAR)', 'Semi-Additive Measures & Dynamic Segmentation']],
                    ['title' => 'Module 4: Visualization Best Practices & Design Systems', 'duration' => '2 Weeks', 'topics' => ['Custom Themes & Color Psychology', 'Bookmarks, Selection Pane & Drill-Throughs', 'Conditional Formatting & Dynamic Tooltips', 'Accessibility & Mobile View Optimization']],
                    ['title' => 'Module 5: Power BI Service, Governance & Fabric', 'duration' => '1 Week', 'topics' => ['Workspaces, Apps & Deployment Pipelines', 'Row-Level Security (Static & Dynamic)', 'On-Premises Data Gateway Configuration', 'Introduction to Microsoft Fabric Lakehouse']],
                ]),
            ],
            [
                'id'          => 'course-sql-analytics',
                'title'       => 'SQL for Data Analytics & Cloud Data Warehousing (PostgreSQL & Snowflake)',
                'slug'        => 'sql-data-analytics-cloud-warehousing',
                'cat'         => 'sql-data-engineering',
                'summary'     => 'Zero-to-advanced SQL masterclass covering complex window functions, CTEs, query optimization, PostgreSQL, Snowflake, and automated data pipelines.',
                'duration'    => '2 Months / 60 Hours',
                'mode'        => 'CLASSROOM',
                'price'       => 22000,
                'salary'      => '₹ 5.0 - 13.0 LPA',
                'rating'      => 4.9,
                'enrolled'    => 9800,
                'featured'    => 1,
                'partners'    => 'JP Morgan, Wells Fargo, Amazon, Capgemini, TCS',
                'highlights'  => wp_json_encode([
                    'Enterprise SQL Query Optimization & Performance Tuning',
                    'PostgreSQL & Snowflake Cloud Warehouse Real Data Sets',
                    'Advanced Window Functions, Aggregations & Pivot Queries',
                    'Live Database Schema Design & Analytics Reporting',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Relational Foundations & Complex Queries', 'duration' => '2 Weeks', 'topics' => ['ANSI SQL Syntax & Constraints', 'Multi-table INNER, LEFT, RIGHT, FULL & SELF Joins', 'Subqueries & Correlated Subqueries', 'Set Operations: UNION, INTERSECT, EXCEPT']],
                    ['title' => 'Module 2: Advanced Window Functions & CTEs', 'duration' => '2 Weeks', 'topics' => ['OVER() Clause, PARTITION BY, ORDER BY', 'Ranking: ROW_NUMBER, RANK, DENSE_RANK, NTILE', 'Value Functions: LAG, LEAD, FIRST_VALUE, LAST_VALUE', 'Recursive Common Table Expressions (CTEs)']],
                    ['title' => 'Module 3: Database Optimization & Indexing', 'duration' => '2 Weeks', 'topics' => ['Query Execution Plans & EXPLAIN ANALYZE', 'B-Tree, Hash & GIN Indexing Strategies', 'Partitioning Large Datasets', 'Handling NULLs, Data Type Castings & Regex']],
                    ['title' => 'Module 4: Cloud Warehousing with Snowflake', 'duration' => '2 Weeks', 'topics' => ['Snowflake Architecture & Virtual Warehouses', 'Loading JSON & Semi-Structured Data', 'Time Travel & Zero-Copy Cloning', 'Connecting Snowflake to Power BI & Tableau']],
                ]),
            ],
            [
                'id'          => 'course-python-analytics',
                'title'       => 'Python for Data Analytics & Exploratory Data Science (NumPy, Pandas, Streamlit)',
                'slug'        => 'python-data-analytics-exploratory-science',
                'cat'         => 'python-for-analytics-ai',
                'summary'     => 'Become an expert in Python for analytics: master Pandas, NumPy, statistical hypothesis testing, Matplotlib, Seaborn, and build interactive Streamlit analytics apps.',
                'duration'    => '3 Months / 80 Hours',
                'mode'        => 'ONLINE',
                'price'       => 28000,
                'salary'      => '₹ 6.5 - 16.0 LPA',
                'rating'      => 4.91,
                'enrolled'    => 11200,
                'featured'    => 1,
                'partners'    => 'Google, Amazon, Swiggy, Zomato, Deloitte',
                'highlights'  => wp_json_encode([
                    'Exploratory Data Analysis on 500k+ Row Enterprise Datasets',
                    'Interactive Analytics Dashboards with Streamlit & Plotly',
                    'Statistical Testing, Correlation & Predictive Forecasting',
                    'Automated Excel & Database Data Wrangling Scripts',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Python Core Essentials for Analytics', 'duration' => '2 Weeks', 'topics' => ['Data Structures: Lists, Tuples, Dictionaries, Sets', 'List Comprehensions & Lambda Functions', 'File I/O: CSV, JSON, Parquet, Excel Files', 'Error Handling & Modular Programming']],
                    ['title' => 'Module 2: High-Performance Computing with NumPy & Pandas', 'duration' => '3 Weeks', 'topics' => ['NumPy Arrays, Broadcasting & Vectorized Operations', 'Pandas DataFrames, Series & Indexing', 'Data Cleaning, Missing Values & Duplicates', 'GroupBy, Pivot Tables & Reshaping (Melt/Stack)']],
                    ['title' => 'Module 3: Data Visualization & Exploratory Data Analysis (EDA)', 'duration' => '3 Weeks', 'topics' => ['Matplotlib Foundations & Subplots', 'Seaborn Statistical Plots (Heatmaps, Pairplots, Boxplots)', 'Interactive Plotly Visualizations', 'Univariate, Bivariate & Multivariate Analysis']],
                    ['title' => 'Module 4: Statistical Analysis & Business Forecasting', 'duration' => '2 Weeks', 'topics' => ['Descriptive vs Inferential Statistics', 'Hypothesis Testing (t-tests, Chi-square, ANOVA)', 'Correlation vs Causation', 'Time-Series Decomposition & Moving Averages']],
                    ['title' => 'Module 5: Interactive Web Apps with Streamlit', 'duration' => '2 Weeks', 'topics' => ['Building Data Dashboards with Streamlit', 'User Inputs: Sliders, Dropdowns & Date Pickers', 'Connecting to Cloud Databases', 'Deploying on Streamlit Community Cloud']],
                ]),
            ],
            [
                'id'          => 'course-tableau-specialist',
                'title'       => 'Tableau Desktop & Server Visual Analytics Specialist',
                'slug'        => 'tableau-desktop-server-visual-analytics',
                'cat'         => 'business-intelligence-visualization',
                'summary'     => 'Comprehensive Tableau certification training covering Level of Detail (LOD) expressions, parameters, advanced calculations, and Tableau Server governance.',
                'duration'    => '2 Months / 60 Hours',
                'mode'        => 'HYBRID',
                'price'       => 24000,
                'salary'      => '₹ 6.0 - 14.5 LPA',
                'rating'      => 4.88,
                'enrolled'    => 8400,
                'featured'    => 0,
                'partners'    => 'Deloitte, Salesforce, Accenture, Cognizant, Tech Mahindra',
                'highlights'  => wp_json_encode([
                    'Tableau Desktop Certified Associate Exam Alignment',
                    'Complex Level of Detail (LOD) Calculations & Sets',
                    'Tableau Server Publishing, Scheduling & Permissions',
                    'Executive Dashboard Storytelling Portfolio',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Tableau Desktop Architecture & Data Prep', 'duration' => '2 Weeks', 'topics' => ['Data Connections: Live vs Extracts', 'Tableau Relationships vs Joins vs Blends', 'Data Interpreter & Splitting Fields', 'Building Core Visuals: Heat Maps, Treemaps, Bullet Graphs']],
                    ['title' => 'Module 2: Calculations & Level of Detail (LOD) Expressions', 'duration' => '2 Weeks', 'topics' => ['Calculated Fields: String, Date & Number Functions', 'Table Calculations & Quick Table Calculations', 'FIXED, INCLUDE & EXCLUDE LOD Expressions', 'Cohort Analysis using LODs']],
                    ['title' => 'Module 3: Parameters, Sets & Dynamic Dashboards', 'duration' => '2 Weeks', 'topics' => ['Parameter Actions & Set Actions', 'Dynamic Measure/Dimension Selectors', 'Container Hierarchy: Tiled vs Floating', 'Dashboard Layout Optimization & Action Filters']],
                    ['title' => 'Module 4: Tableau Server, Cloud & Governance', 'duration' => '2 Weeks', 'topics' => ['Publishing Workbooks & Data Sources', 'User Filters & Row-Level Security', 'Extract Refresh Scheduling & Alerts', 'Creating Interactive Data Stories']],
                ]),
            ],
            [
                'id'          => 'course-business-analyst',
                'title'       => 'Business Analyst & Product Analytics Certification (Agile, Jira & Metrics)',
                'slug'        => 'business-analyst-product-analytics',
                'cat'         => 'business-product-analytics',
                'summary'     => 'Bridge business strategy with data. Master requirement gathering, BRD/FRD documentation, user stories in Jira, Agile Scrum, customer funnel metrics, and cohort analytics.',
                'duration'    => '2.5 Months / 75 Hours',
                'mode'        => 'CLASSROOM',
                'price'       => 30000,
                'salary'      => '₹ 6.5 - 15.5 LPA',
                'rating'      => 4.89,
                'enrolled'    => 7600,
                'featured'    => 0,
                'partners'    => 'Zoho, McKinsey, Boston Consulting Group, Zomato, Flipkart',
                'highlights'  => wp_json_encode([
                    'BRD, FRD, SRS & User Story Documentation Mastery',
                    'Jira & Confluence Enterprise Workflow Simulations',
                    'Product Analytics: Cohort, Retention & A/B Test Modeling',
                    'Mock Stakeholder Interview Rounds with Product Leaders',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Business Analysis Frameworks & SDLC', 'duration' => '2 Weeks', 'topics' => ['Roles of Business Analyst vs Product Manager', 'SDLC Models: Agile, Scrum, Kanban & Waterfall', 'Stakeholder Management & RACI Matrix', 'Business Process Modeling (BPMN 2.0) with Lucidchart']],
                    ['title' => 'Module 2: Requirements Engineering & Documentation', 'duration' => '3 Weeks', 'topics' => ['BRD (Business Requirements Document) Creation', 'FRD (Functional Requirements Document) Drafting', 'Writing Effective User Stories & Acceptance Criteria (Gherkin)', 'Use Cases & Activity Diagrams']],
                    ['title' => 'Module 3: Agile Execution with Jira & Confluence', 'duration' => '2 Weeks', 'topics' => ['Configuring Jira Scrum Boards & Backlogs', 'Sprint Planning, Story Point Estimation (Planning Poker)', 'Burndown Charts & Velocity Metrics', 'Confluence Product Documentation Architecture']],
                    ['title' => 'Module 4: Product Analytics & Growth Funnels', 'duration' => '3 Weeks', 'topics' => ['North Star Metrics & KPI Trees', 'Acquisition, Activation, Retention, Referral, Revenue (AARRR)', 'Cohort Retention Tables & Churn Prediction', 'Designing and Analyzing A/B Tests with Statistical Significance']],
                ]),
            ],
            [
                'id'          => 'course-advanced-excel',
                'title'       => 'Advanced Excel & Financial Modeling Masterclass (VBA, Power Query)',
                'slug'        => 'advanced-excel-financial-modeling',
                'cat'         => 'advanced-excel-financial-modeling',
                'summary'     => 'Master dynamic Excel arrays, Power Query automated ETL pipelines, financial statement three-statement models, DCF valuation, and automated macros with VBA.',
                'duration'    => '1.5 Months / 45 Hours',
                'mode'        => 'HYBRID',
                'price'       => 18000,
                'salary'      => '₹ 4.5 - 11.0 LPA',
                'rating'      => 4.87,
                'enrolled'    => 13500,
                'featured'    => 0,
                'partners'    => 'KPMG, EY, Grant Thornton, Goldman Sachs, HDFC Bank',
                'highlights'  => wp_json_encode([
                    '3-Statement Financial Modeling & Valuation Models',
                    'Power Query ETL Automation for Messy Datasets',
                    'Dynamic Array Functions: XLOOKUP, FILTER, UNIQUE, LAMBDA',
                    'Executive KPI Dashboarding with Interactive Slicers',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Modern Dynamic Array Functions', 'duration' => '2 Weeks', 'topics' => ['XLOOKUP, XMATCH & Two-Way Lookups', 'FILTER, SORT, SORTBY, UNIQUE & SEQUENCE', 'LET & LAMBDA Custom Reusable Functions', 'Nested IFs, SUMIFS, COUNTIFS with Wildcards']],
                    ['title' => 'Module 2: Power Query & Automated ETL in Excel', 'duration' => '2 Weeks', 'topics' => ['Extracting from Multiple Folders, CSVs & Web', 'Unpivoting Columns & Cleansing Messy Data', 'Data Type Formatting & Error Handling', 'Building Refreshable ETL Workflows']],
                    ['title' => 'Module 3: Financial Statement Modeling & Valuation', 'duration' => '1.5 Weeks', 'topics' => ['Integrated 3-Statement Financial Model (Income, Balance, Cash Flow)', 'Working Capital & Depreciation Schedules', 'Discounted Cash Flow (DCF) Valuation', 'Scenario Analysis with Data Tables & Goal Seek']],
                    ['title' => 'Module 4: Automation with VBA & Macros', 'duration' => '1 Week', 'topics' => ['Recording & Optimizing Macros', 'VBA Editor, Variables & Loops (For Each, While)', 'Automating Report Generation and Email Dispatch', 'Creating Userforms & Interactive Controls']],
                ]),
            ],
            [
                'id'          => 'course-digital-marketing',
                'title'       => 'Digital Marketing & Growth Analytics (GA4, Meta & Performance Marketing)',
                'slug'        => 'digital-marketing-growth-analytics',
                'cat'         => 'digital-marketing-growth-analytics',
                'summary'     => 'Master Google Analytics 4 (GA4), Meta Ads Manager, Google Tag Manager, Multi-Touch Attribution, Conversion Rate Optimization (CRO), and growth metrics.',
                'duration'    => '3 Months / 90 Hours',
                'mode'        => 'HYBRID',
                'price'       => 27000,
                'salary'      => '₹ 5.0 - 13.5 LPA',
                'rating'      => 4.89,
                'enrolled'    => 9100,
                'featured'    => 0,
                'partners'    => 'GroupM, Dentsu, Swiggy, Nykaa, Amazon India',
                'highlights'  => wp_json_encode([
                    'Live Ad Spends on Meta & Google Ads Campaigns',
                    'Google Analytics 4 (GA4) & GTM Server-Side Tagging',
                    'Multi-Touch Attribution Modeling & ROAS Maximization',
                    'Complete SEO, SEM, Programmatic & Social Stack',
                ]),
                'syllabus'    => wp_json_encode([
                    ['title' => 'Module 1: Digital Landscape & Technical SEO Analytics', 'duration' => '3 Weeks', 'topics' => ['Search Engine Architecture & Crawl Budgets', 'Keyword Research with Semrush & Ahrefs', 'Technical SEO Auditing & Core Web Vitals', 'Google Search Console Data Mining']],
                    ['title' => 'Module 2: Performance Marketing (Google & Meta Ads)', 'duration' => '3 Weeks', 'topics' => ['Google Search, Display & Performance Max Campaigns', 'Meta Ads Manager: Advantage+ & Lookalike Audiences', 'A/B Creative Testing & Ad Copywriting', 'Cost Per Acquisition (CPA) & ROAS Optimization']],
                    ['title' => 'Module 3: Google Tag Manager (GTM) & GA4 Measurement', 'duration' => '3 Weeks', 'topics' => ['GTM Container Setup, Triggers & Variables', 'Custom Event Tracking (Form Submits, Video, Scroll)', 'GA4 Exploration Reports & Funnel Analysis', 'Server-Side Tagging & Privacy Compliance']],
                    ['title' => 'Module 4: Marketing Attribution & Growth Strategy', 'duration' => '3 Weeks', 'topics' => ['First-Click, Last-Click & Data-Driven Attribution', 'Customer Lifetime Value (LTV) vs Customer Acquisition Cost (CAC)', 'Conversion Rate Optimization (CRO) & Heatmaps with Hotjar', 'Building Marketing Dashboards in Looker Studio']],
                ]),
            ],
        ];

        foreach ($courses_data as $c) {
            $pid = wp_insert_post([
                'post_title'   => $c['title'],
                'post_name'    => $c['slug'],
                'post_type'    => 'course',
                'post_status'  => 'publish',
            ]);
            if ($pid && !is_wp_error($pid)) {
                wp_set_object_terms($pid, $c['cat'], 'course_category');
                update_post_meta($pid, 'custom_id',       $c['id']);
                update_post_meta($pid, 'summary',         $c['summary']);
                update_post_meta($pid, 'duration',        $c['duration']);
                update_post_meta($pid, 'mode',            $c['mode']);
                update_post_meta($pid, 'price',           $c['price']);
                update_post_meta($pid, 'expected_salary', $c['salary']);
                update_post_meta($pid, 'rating',          $c['rating']);
                update_post_meta($pid, 'enrolled_count',  $c['enrolled']);
                update_post_meta($pid, 'is_featured',     $c['featured']);
                update_post_meta($pid, 'hiring_partners', $c['partners']);
                update_post_meta($pid, 'highlights',      $c['highlights']);
                update_post_meta($pid, 'syllabus',        $c['syllabus']);
            }
        }

        // 4. Placements (Data Analytics & Business Intelligence)
        $placements_data = [
            ['Dinesh Kumar',        'Amazon',             'Lead Data Analyst',             '18.5 LPA', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 'course-da-mastery',     'branch-omr',          'The hands-on SQL and Power BI dashboarding case studies at Seeyam Technologies gave me the technical confidence to clear Amazon\'s analytics bar raiser rounds.'],
            ['Priyanka Swaminathan','Microsoft',          'Power BI & Fabric Consultant',  '21.0 LPA', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80', 'course-power-bi',       'branch-vadapalani',   'From a non-technical commerce background to Microsoft! The DAX modeling, Power Query, and enterprise reporting curriculum made all the difference.'],
            ['Rajesh Varma',        'JP Morgan Chase',    'SQL & BI Data Engineer',        '16.8 LPA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'course-sql-analytics',   'branch-marathahalli', 'The complex window functions, query optimization, and Snowflake warehouse projects were taught with true production datasets. Highly recommended!'],
            ['Keerthana Natarajan', 'Deloitte Digital',   'Tableau Visual Analytics Lead', '14.2 LPA', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80', 'course-tableau-specialist','branch-omr',          'Level of Detail expressions and executive dashboard storytelling modules helped me transition from a support analyst to a lead visual analytics consultant.'],
            ['Mohammed Farhan',     'Zomato / Blinkit',   'Product & Growth Analyst',      '19.5 LPA', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', 'course-business-analyst','branch-hitec',        'The cohort retention, A/B experimentation, and Python EDA modules were top notch. I presented my course capstone in the interview and landed the role.'],
            ['Sneha Reddy',         'Accenture Strategy', 'Financial Modeling & BI Analyst','11.0 LPA', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', 'course-advanced-excel',  'branch-tambaram',     'The trainer had 14+ years in financial modeling and equity research. Building 3-statement models and Power Query ETL was an incredible learning curve.'],
        ];

        foreach ($placements_data as [$name, $company, $role, $ctc, $avatar, $course_id, $branch_id, $quote]) {
            $pid = wp_insert_post(['post_title' => $name . ' - ' . $company, 'post_type' => 'placement', 'post_status' => 'publish']);
            if ($pid && !is_wp_error($pid)) {
                update_post_meta($pid, 'student_name',      $name);
                update_post_meta($pid, 'company_name',      $company);
                update_post_meta($pid, 'role',              $role);
                update_post_meta($pid, 'package_ctc',       $ctc);
                update_post_meta($pid, 'student_avatar_url',$avatar);
                update_post_meta($pid, 'course_id',         $course_id);
                update_post_meta($pid, 'branch_id',         $branch_id);
                update_post_meta($pid, 'quote',             $quote);
            }
        }

        // 5. Reviews (Data Analytics & Business Intelligence)
        $reviews_data = [
            ['Aditya Prakash',  'Life-changing Data Analytics Master Program!',          'I joined Seeyam Technologies as a non-tech graduate with just basic computer knowledge. The Data Analytics Master Program was structured brilliantly — starting from Excel and Advanced SQL all the way to Power BI and Python for analytics. The trainers had 12+ years of real industry experience and the e-commerce analytics capstone was invaluable. Placed at Cognizant with 8.5 LPA!', 5, 'course-da-mastery', 'branch-omr'],
            ['Priya Venkatesh', 'Power BI DAX course exceeded all expectations',         'Coming from a finance background (B.Com graduate), I needed to upskill into Business Intelligence. The Power BI masterclass at Vadapalani campus was incredible. We learned advanced DAX formulas, Power Query M-code, and built live financial P&L dashboards. Placed at an MNC with a 7.2 LPA offer.', 5, 'course-power-bi', 'branch-vadapalani'],
            ['Karthik Narayanan','SQL for Analytics course opened doors to Wells Fargo',  'The SQL course at Marathahalli campus was pure hands-on. We solved 300+ LeetCode-style business queries, window functions, and learned query plan optimization with EXPLAIN ANALYZE on PostgreSQL and Snowflake. Landed a SQL Data Analyst position at Wells Fargo with 9.5 LPA.', 5, 'course-sql-analytics', 'branch-marathahalli'],
            ['Ananya Krishnan', 'From manual Excel reporting to Tableau Specialist',     'I had been working in Excel operations for 3 years without meaningful career growth. Enrolling in the Tableau Specialist program at Seeyam Technologies completely transformed my career trajectory. The LOD expressions and dashboard UX sessions were elite. Placed at Deloitte with 11.5 LPA.', 5, 'course-tableau-specialist', 'branch-omr'],
        ];
        foreach ($reviews_data as [$name, $title, $body, $rating, $course_id, $branch_id]) {
            $pid = wp_insert_post(['post_title' => $title, 'post_content' => $body, 'post_type' => 'review', 'post_status' => 'publish']);
            if ($pid && !is_wp_error($pid)) {
                update_post_meta($pid, 'student_name',    $name);
                update_post_meta($pid, 'rating',          $rating);
                update_post_meta($pid, 'review_status',   'APPROVED');
                update_post_meta($pid, 'completion_year', '2026');
                update_post_meta($pid, 'course_id',       $course_id);
                update_post_meta($pid, 'branch_id',       $branch_id);
            }
        }

        // 6. Batches (Data Analytics & Business Intelligence)
        $batches_data = [
            ['course-da-mastery',     'branch-omr',          'Dr. K. Senthil Nathan (Ex-Amazon Analytics Lead)', '14+ Yrs Exp', '2026-09-15', 'Mon - Fri: 7:30 AM - 9:30 AM (Morning)',  30, 7,  'UPCOMING'],
            ['course-power-bi',       'branch-vadapalani',   'P. Meenakshi (Microsoft Certified PL-300 Lead)',   '10+ Yrs Exp', '2026-09-20', 'Sat & Sun: 10:00 AM - 2:00 PM (Weekend)', 35, 9,  'UPCOMING'],
            ['course-sql-analytics',  'branch-marathahalli', 'Arunachalam S. (Senior Cloud Database Architect)', '12+ Yrs Exp', '2026-09-18', 'Mon - Fri: 6:30 PM - 8:30 PM (Evening)', 30, 5,  'UPCOMING'],
            ['course-python-analytics','branch-hitec',       'Radhika Pillai (Principal Data Scientist)',        '11+ Yrs Exp', '2026-09-22', 'Sat & Sun: 2:30 PM - 6:30 PM (Weekend)', 25, 4,  'UPCOMING'],
            ['course-tableau-specialist','branch-tambaram',  'Vigneshwaran M. (Tableau Certified Architect)',    '9+ Yrs Exp',  '2026-09-16', 'Mon - Fri: 10:00 AM - 12:00 PM (Regular)',30, 12, 'UPCOMING'],
        ];
        foreach ($batches_data as [$course_id, $branch_id, $instructor, $exp, $date, $timing, $max, $left, $status]) {
            $pid = wp_insert_post(['post_title' => $instructor . ' — ' . $date, 'post_type' => 'batch', 'post_status' => 'publish']);
            if ($pid && !is_wp_error($pid)) {
                update_post_meta($pid, 'course_id',       $course_id);
                update_post_meta($pid, 'branch_id',       $branch_id);
                update_post_meta($pid, 'instructor_name', $instructor);
                update_post_meta($pid, 'instructor_exp',  $exp);
                update_post_meta($pid, 'start_date',      $date);
                update_post_meta($pid, 'timing',          $timing);
                update_post_meta($pid, 'max_seats',       $max);
                update_post_meta($pid, 'seats_left',      $left);
                update_post_meta($pid, 'batch_status',    $status);
            }
        }

        // 7. Sample Leads (Data Analytics)
        $leads_data = [
            ['Arun Prakash',    'arun.prakash@gmail.com', '+91 98401 23456', 'course-da-mastery',    'branch-omr',        'NEW',        'Website Hero Search', 'Looking for morning batch in OMR campus.'],
            ['Kavitha Sundaram','kavitha.s@gmail.com',    '+91 97890 54321', 'course-power-bi',      'branch-vadapalani', 'CONTACTED',  'Course Page Modal',   'Spoke to candidate. Shared Power BI syllabus PDF on WhatsApp.'],
            ['Rohit Sharma',    'rohit.analytics@gmail.com','+91 99887 66554','course-sql-analytics', 'branch-hitec',      'COUNSELING', 'WhatsApp Direct',     'Working professional in IT operations. Wants SQL & Snowflake for transition to Data Analyst.'],
            ['Siddharth Nair',  'sid.nair@outlook.com',   '+91 94440 11223', 'course-tableau-specialist','branch-marathahalli','ENROLLED', 'Walk-in Inquiry',     'Enrolled for Tableau Specialist weekend batch. Fee paid via UPI.'],
        ];
        foreach ($leads_data as [$name, $email, $phone, $course_id, $branch_id, $status, $source, $note]) {
            $pid = wp_insert_post(['post_title' => $name . ' (' . $phone . ')', 'post_type' => 'lead', 'post_status' => 'publish']);
            if ($pid && !is_wp_error($pid)) {
                update_post_meta($pid, 'student_name',  $name);
                update_post_meta($pid, 'student_email', $email);
                update_post_meta($pid, 'student_phone', $phone);
                update_post_meta($pid, 'course_id',     $course_id);
                update_post_meta($pid, 'branch_id',     $branch_id);
                update_post_meta($pid, 'lead_status',   $status);
                update_post_meta($pid, 'source',        $source);
                update_post_meta($pid, 'notes_json',    wp_json_encode([['id' => 'note-' . time() . rand(100,999), 'timestamp' => current_time('mysql'), 'text' => $note, 'author' => 'Front Desk Counselor']]));
            }
        }

        // 8. Standard WordPress Web Pages (Editable in WP Admin -> Pages)
        $standard_pages = [
            [
                'title'   => 'Home — Seeyam Technologies Premier Data Analytics & BI Institute',
                'slug'    => 'home',
                'excerpt' => 'Ranked #1 Data Analytics & Business Intelligence Institute. Master Power BI, Advanced SQL, Python for Analytics, Tableau, and Financial Modeling with guaranteed placements.',
                'content' => '<h2>Build Your Future with Enterprise Data Analytics & Business Intelligence</h2><p>Welcome to Seeyam Technologies, South India\'s premier center of excellence for Data Analytics, Business Intelligence, Python Data Science, and Growth Analytics.</p><h3>Why Choose Seeyam Technologies?</h3><ul><li><strong>100% Placement Assurance:</strong> Dedicated placement cell with 200+ active hiring partners including Amazon, Microsoft, JP Morgan, Deloitte, and Accenture.</li><li><strong>Corporate Analytics Leads as Mentors:</strong> 10+ to 14+ years of production experience in BI architecture and data engineering.</li><li><strong>State-of-the-Art Labs:</strong> 24x7 lab infrastructure across Chennai, Bangalore, and Hyderabad with Snowflake and Power BI environments.</li><li><strong>Flexible Learning Modes:</strong> Classroom, Live Online, and Hybrid Weekend batches.</li></ul><p>Visit our campuses or book a free 1-on-1 counseling session with our senior data analytics mentors today.</p>',
                'seo_title' => 'Seeyam Technologies | Premier Data Analytics, Power BI & Placement Institute',
                'seo_desc'  => 'Master Data Analytics, Power BI, Advanced SQL, Python, and Tableau with guaranteed placement drives across Chennai, Bangalore & Hyderabad.',
            ],
            [
                'title'   => 'Courses & Data Analytics Certifications',
                'slug'    => 'courses',
                'excerpt' => 'Explore 8+ industry-vetted certification programs in Data Analytics, Power BI, Advanced SQL, Python for Analytics, Tableau, Business Analytics, and Financial Modeling.',
                'content' => '<h2>Master In-Demand Analytics Skills with Guaranteed Placements</h2><p>Our curriculum is designed by senior data architects and BI leads from Tier-1 IT companies to give you enterprise-grade, production-ready capabilities.</p><h3>Our Masterclass Certification Programs:</h3><ul><li><strong>Data Analytics Master Program:</strong> Power BI, SQL, Python, Excel & Tableau (4 Months / 120 Hours).</li><li><strong>Power BI & Business Intelligence Masterclass:</strong> DAX, Power Query & Microsoft Fabric (2.5 Months / 70 Hours).</li><li><strong>SQL for Data Analytics & Cloud Warehousing:</strong> PostgreSQL & Snowflake (2 Months / 60 Hours).</li><li><strong>Python for Data Analytics & Exploratory Data Science:</strong> Pandas, NumPy & Streamlit (3 Months / 80 Hours).</li><li><strong>Tableau Visual Analytics Specialist:</strong> LOD Expressions & Executive Storytelling (2 Months / 60 Hours).</li><li><strong>Business Analyst & Product Analytics:</strong> Agile, Jira, Funnels & Cohorts (2.5 Months / 75 Hours).</li><li><strong>Advanced Excel & Financial Modeling:</strong> 3-Statement Valuation & VBA (1.5 Months / 45 Hours).</li><li><strong>Digital Marketing & Growth Analytics:</strong> GA4, Meta Ads & Performance Marketing (3 Months / 90 Hours).</li></ul>',
                'seo_title' => 'Data Analytics & Business Intelligence Courses | Seeyam Technologies',
                'seo_desc'  => 'Explore top-rated Data Analytics courses with real-world capstone projects, cloud data warehouses, and 100% placement support.',
            ],
            [
                'title'   => 'Campuses & Classroom Training Centers',
                'slug'    => 'branches',
                'excerpt' => 'Visit state-of-the-art tech labs in OMR Navalur, Vadapalani, Tambaram, Marathahalli (Bangalore), and HITEC City (Hyderabad). High-compute labs & 24/7 server access.',
                'content' => '<h2>State-of-the-Art Campus Locations Across South India</h2><p>Experience hands-on learning with ultra-fast gigabit connectivity, live cloud sandboxes, enterprise Snowflake databases, and dedicated workstation bays.</p><h3>Our Campus Locations:</h3><ul><li><strong>OMR - Navalur (HQ), Chennai:</strong> Plot No. 42, Rajiv Gandhi Salai (OMR), Opposite to Vivira Mall.</li><li><strong>Vadapalani, Chennai:</strong> 2nd Floor, Arcot Road, Next to Forum Vijaya Mall.</li><li><strong>Tambaram Sanatorium, Chennai:</strong> GST Road, Opposite to MEPZ Main Gate.</li><li><strong>Marathahalli, Bangalore:</strong> Outer Ring Road, Near Innovative Multiplex.</li><li><strong>HITEC City - Madhapur, Hyderabad:</strong> Image Gardens Road, Near Cyber Towers.</li></ul><p>Central Helpline: <strong>+91 89399 15577</strong> | Open Mon - Sun: 7:00 AM - 9:00 PM</p>',
                'seo_title' => 'Campuses & Training Centers | Chennai, Bangalore, Hyderabad | Seeyam',
                'seo_desc'  => 'Find your nearest Seeyam Technologies training campus across Chennai, Bangalore, and Hyderabad. High-tech labs with 100% placement drives.',
            ],
            [
                'title'   => '100% Placement Records & Student Success Stories',
                'slug'    => 'placements',
                'excerpt' => 'Over 50,000+ alumni placed in top tier tech MNCs like Amazon, Microsoft, JP Morgan, Deloitte, Zoho, and TCS with average salary packages of 6.0 to 22.0 LPA.',
                'content' => '<h2>Transforming Careers — From Freshers to High-Earning Analytics Professionals</h2><p>Our dedicated corporate placement cell works tirelessly with 200+ partner companies to schedule daily interview drives, technical mocks, portfolio reviews, and salary negotiations.</p><h3>Recent Alumni Achievements:</h3><ul><li><strong>Dinesh Kumar:</strong> Placed at <em>Amazon</em> as Lead Data Analyst (18.5 LPA).</li><li><strong>Priyanka Swaminathan:</strong> Placed at <em>Microsoft</em> as Power BI & Fabric Consultant (21.0 LPA).</li><li><strong>Rajesh Varma:</strong> Placed at <em>JP Morgan Chase</em> as SQL & BI Data Engineer (16.8 LPA).</li><li><strong>Keerthana Natarajan:</strong> Placed at <em>Deloitte Digital</em> as Tableau Visual Analytics Lead (14.2 LPA).</li><li><strong>Mohammed Farhan:</strong> Placed at <em>Zomato / Blinkit</em> as Product & Growth Analyst (19.5 LPA).</li><li><strong>Sneha Reddy:</strong> Placed at <em>Accenture Strategy</em> as Financial Modeling Analyst (11.0 LPA).</li></ul>',
                'seo_title' => '100% Placement Records & Alumni Success Stories | Seeyam Technologies',
                'seo_desc'  => 'See how 50,000+ graduates landed jobs at Amazon, Microsoft, JP Morgan, and top MNCs through Seeyam Technologies.',
            ],
            [
                'title'   => 'Verified Student Feedback & Course Reviews',
                'slug'    => 'reviews',
                'excerpt' => 'Read genuine feedback from 50,000+ graduates across Chennai, Bangalore, and Hyderabad on trainer quality, lab facilities, and placement assistance.',
                'content' => '<h2>What Our 50,000+ Alumni Say About Seeyam Technologies</h2><p>With an average student rating of <strong>4.9★ out of 5</strong> across Google Reviews, Trustpilot, and CourseReport, Seeyam Technologies is consistently ranked South India\'s #1 IT training institute.</p><h3>Key Student Highlights:</h3><ul><li><em>"Life-changing Java Full Stack training! Mentors explain complex Spring Boot microservices with real-world architecture examples."</em> — Aditya Prakash</li><li><em>"Coming from a non-IT background, the MERN stack course gave me the skills and confidence to crack Microsoft."</em> — Priya Venkatesh</li><li><em>"Best Data Science institute in Hyderabad hands down. Placed with 12 LPA."</em> — Divya Lakshmi</li></ul>',
                'seo_title' => 'Student Reviews & 4.9★ Ratings | Seeyam Technologies',
                'seo_desc'  => 'Read authentic reviews from 50,000+ students who mastered Full Stack, DevOps, AI, and QA at Seeyam Technologies.',
            ],
            [
                'title'   => 'About Seeyam Technologies',
                'slug'    => 'about-us',
                'excerpt' => 'Learn about Seeyam Technologies mission, leadership team, 50,000+ alumni, and 100% placement assurance.',
                'content' => '<h2>Bridging the Gap Between Academics & Tech Industry Excellence</h2><p>Seeyam Technologies is South India\'s premier center of excellence for emerging technologies, offering production-grade IT training mentored by senior corporate architects from Tier-1 tech giants.</p><h3>Why Choose Seeyam Technologies?</h3><ul><li><strong>100% Placement Assurance:</strong> Dedicated corporate placement cell organizing daily interview drives with 200+ hiring partners.</li><li><strong>Corporate Architect Mentors:</strong> 10+ to 16+ years of real-time production experience.</li><li><strong>High-Compute Labs:</strong> 24x7 lab access with live SAP servers, AWS sandboxes, and GPU deep learning rigs.</li><li><strong>ISO 9001:2015 & NASSCOM Certified:</strong> Globally recognized certifications.</li></ul>',
                'seo_title' => 'About Us | Seeyam Technologies — South India\'s Premier IT Training Institute',
                'seo_desc'  => 'Discover our 12+ year journey of training and placing 50,000+ engineers with leading global technology brands.',
            ],
            [
                'title'   => 'Contact Us & Campus Locations',
                'slug'    => 'contact-us',
                'excerpt' => 'Connect with our career counselors, book a free demo session, or visit any of our campuses in Chennai, Bangalore, and Hyderabad.',
                'content' => '<h2>Get in Touch with Our Admissions & Counseling Team</h2><p>Have questions about course curriculum, placement drives, batch schedules, or fee installment options? Our senior technical advisors are available 7 days a week.</p><h3>Central Helpline & Support</h3><p><strong>Phone:</strong> +91 89399 15577<br/><strong>Email:</strong> info@seeyamtechnologies.com<br/><strong>Hours:</strong> Mon - Sun: 7:00 AM - 9:00 PM</p>',
                'seo_title' => 'Contact Us & Campus Admissions | Seeyam Technologies',
                'seo_desc'  => 'Get in touch with our admissions team. Call +91 89399 15577 or visit our campuses in Chennai, Bangalore, and Hyderabad.',
            ],
            [
                'title'   => 'Frequently Asked Questions (FAQs)',
                'slug'    => 'faq',
                'excerpt' => 'Common questions regarding course admissions, 100% placement assistance guarantee, fee installment options, and demo classes.',
                'content' => '<h2>Frequently Asked Questions — Seeyam Technologies</h2><h3>1. How does Seeyam guarantee 100% placement assistance?</h3><p>Our dedicated placement cell conducts unlimited interview drives with 200+ hiring partners until you receive an offer letter.</p><h3>2. Can I attend a free demo class before enrolling?</h3><p>Yes! We offer free 1-on-1 counseling and classroom demo sessions across all our campuses and online.</p><h3>3. Do you offer weekend batches for working professionals?</h3><p>Yes, we provide flexible Weekend batches (Saturday & Sunday) as well as Fast-Track weekday morning and evening sessions.</p><h3>4. Is there an EMI or fee installment option?</h3><p>Yes, we offer 0% interest EMI options through credit cards as well as 2 to 3 flexible fee installment options.</p>',
                'seo_title' => 'Frequently Asked Questions (FAQs) | Seeyam Technologies',
                'seo_desc'  => 'Find answers to frequently asked questions about course admissions, fees, demo classes, and placement drives at Seeyam.',
            ],
            [
                'title'   => 'Terms and Conditions',
                'slug'    => 'terms-and-conditions',
                'excerpt' => 'Standard terms of service, enrollment conditions, code of conduct, and certification requirements.',
                'content' => '<h2>1. Acceptance of Terms</h2><p>By enrolling in any training program, masterclass, or utilizing campus lab infrastructure at Seeyam Technologies, you agree to comply with and be bound by the following terms and conditions.</p><h2>2. Course Curriculum & Certification</h2><p>Certifications are issued upon successful completion of required course modules, mandatory minimum 80% attendance, and submission of verified capstone projects.</p><h2>3. 100% Placement Assistance Policy</h2><p>Placement assistance includes resume building, technical mock interviews, soft skills training, and scheduling of interviews with partner companies until successful placement.</p>',
                'seo_title' => 'Terms and Conditions | Seeyam Technologies',
                'seo_desc'  => 'Official terms of service, student enrollment policies, and placement assistance terms of Seeyam Technologies.',
            ],
            [
                'title'   => 'Privacy Policy',
                'slug'    => 'privacy-policy',
                'excerpt' => 'Our privacy commitments, inquiry data handling, and student record protection policies.',
                'content' => '<h2>Privacy Policy & Data Protection</h2><p>Seeyam Technologies values your privacy. We are committed to protecting the personal information you share with us when inquiring about courses, enrolling in programs, or utilizing our student portal.</p><h3>Information We Collect</h3><p>We collect contact details such as name, email address, and phone number when you submit an inquiry form or register for demo classes. We never sell or share your personal information with third-party advertisers.</p>',
                'seo_title' => 'Privacy Policy & Student Data Protection | Seeyam Technologies',
                'seo_desc'  => 'Learn how Seeyam Technologies collects, protects, and handles student inquiries and personal information.',
            ],
            [
                'title'   => 'Refund & Rescheduling Policy',
                'slug'    => 'refund-policy',
                'excerpt' => 'Our 100% satisfaction demo guarantee, fee installment terms, and batch rescheduling policies.',
                'content' => '<h2>100% Satisfaction & Demo Guarantee</h2><p>We offer free initial demo sessions so students can assess trainer expertise and curriculum quality before committing. If you are not satisfied within the first 3 days of class commencement, you are eligible for a 100% fee refund.</p><h3>Batch Rescheduling</h3><p>Students can switch between weekday morning, weekday evening, or weekend batches at no additional charge with prior counselor notice.</p>',
                'seo_title' => 'Refund & Rescheduling Policy | Seeyam Technologies',
                'seo_desc'  => 'Review our 100% satisfaction demo guarantee, fee refund guidelines, and free batch rescheduling policy.',
            ],
        ];

        foreach ($standard_pages as $sp) {
            $existing_page = get_page_by_path($sp['slug'], OBJECT, 'page');
            if (!$existing_page) {
                $pid = wp_insert_post([
                    'post_title'   => $sp['title'],
                    'post_name'    => $sp['slug'],
                    'post_content' => $sp['content'],
                    'post_excerpt' => $sp['excerpt'],
                    'post_type'    => 'page',
                    'post_status'  => 'publish',
                ]);
            } else {
                $pid = $existing_page->ID;
                wp_update_post([
                    'ID'           => $pid,
                    'post_title'   => $sp['title'],
                    'post_content' => $sp['content'],
                    'post_excerpt' => $sp['excerpt'],
                    'post_status'  => 'publish',
                ]);
            }
            if ($pid && !is_wp_error($pid)) {
                if (!empty($sp['seo_title'])) update_post_meta($pid, 'seo_title', $sp['seo_title']);
                if (!empty($sp['seo_desc']))  update_post_meta($pid, 'seo_description', $sp['seo_desc']);
            }
        }

        // 9. Default Settings
        update_option('seeyam_site_options', $this->get_default_settings());
        delete_transient(self::CACHE_KEY);
        return true;
    }
}

new Seeyam_Headless_CMS();

} // end if class_exists
