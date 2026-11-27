import { ArrowRight, ChartNoAxesColumnIncreasing, Check, Eye, Megaphone, MousePointer2, MousePointerClick, Target, UserRoundCheck } from "lucide-react";
import CourseHeroPoster from "./CourseHeroPoster";
import styles from "./CourseHeroVisual.module.css";

const results = [
  { label: "Ad views", value: "5,000", icon: Eye },
  { label: "Clicks", value: "240", icon: MousePointerClick },
  { label: "Sign-ups", value: "24", icon: UserRoundCheck },
];
const steps = ["Goal", "Audience", "Ad", "Results"];

export default function MarketingHeroVisual() {
  return (
    <figure className={styles.stage} aria-label="Example digital marketing campaign and topic overview">
      <div className={styles.marketingDemo} aria-hidden="true">
        <div className={styles.toolbar}>
          <span><Megaphone size={16} /> Campaign workspace</span>
          <span>Sample campaign</span>
        </div>
        <div className={styles.marketingScenes}>
          <div className={`${styles.marketingScene} ${styles.marketingDraft}`}>
            <h2>Get sign-ups for a free workshop</h2>
            <p className={styles.sceneCaption}>Pick the action you want people to take.</p>
            <div className={styles.campaignFields}>
              <div><small>Campaign</small><strong>Free skills workshop</strong></div>
              <div className={styles.selectedField}><small><Check size={13} /> Selected goal</small><strong>Workshop registrations</strong></div>
            </div>
            <div className={styles.campaignAction}>Set audience <ArrowRight size={15} /></div>
          </div>
          <div className={`${styles.marketingScene} ${styles.marketingAudience}`}>
            <h2>Choose who sees the ad</h2>
            <p className={styles.sceneCaption}>Show the offer to learners near the workshop.</p>
            <div className={styles.campaignFields}>
              <div><small>Location</small><strong>Chennai</strong></div>
              <div><small>Audience</small><strong>Graduates & early-career learners</strong></div>
              <div><small>Placements</small><strong>Search & social feeds</strong></div>
              <div><small>Budget</small><strong>₹400 per day · 3 days</strong></div>
            </div>
            <div className={styles.campaignAction}>Preview ad <ArrowRight size={15} /></div>
          </div>
          <div className={`${styles.marketingScene} ${styles.marketingCreative}`}>
            <h2>Show the offer and where to sign up</h2>
            <div className={styles.adPreview}>
              <img src="/images/card-photos/analysis-team.jpg" alt="" />
              <div><small>Sponsored workshop ad</small><strong>Build your next skill.</strong><span>Join a free hands-on workshop in Chennai.</span><b>Register free <ArrowRight size={12} /></b></div>
            </div>
            <p className={styles.creativeDestination}><Target size={14} /> Track when someone completes the registration form.</p>
            <div className={styles.campaignAction}>View results <ArrowRight size={15} /></div>
          </div>
          <div className={`${styles.marketingScene} ${styles.marketingReport}`}>
            <h2><ChartNoAxesColumnIncreasing size={20} /> From ad views to sign-ups</h2>
            <p className={styles.sceneCaption}>Example results after three days.</p>
            <dl className={styles.campaignResults}>
              {results.map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <dt><Icon size={16} /> {label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.campaignCosts}><span>4.8% click rate</span><span>₹50 per sign-up</span></div>
            <p className={styles.campaignInsight}><Check size={15} /> 10% of clicks turned into sign-ups.</p>
          </div>
          <div className={styles.marketingCursor}><span /><MousePointer2 size={23} fill="#171717" stroke="white" /></div>
        </div>
        <ol className={styles.campaignProgress}>
          {steps.map(step => <li key={step}>{step}</li>)}
        </ol>
        <div className={styles.wipe} />
      </div>
      <CourseHeroPoster track="marketing" />
    </figure>
  );
}
