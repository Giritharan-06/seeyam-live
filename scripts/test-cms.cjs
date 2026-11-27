// Run only against a disposable, seeded localhost database and a local production build.
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const { PrismaClient } = require("@prisma/client");
const { chromium } = require(process.env.CMS_TEST_PLAYWRIGHT || "playwright-core");
const sharp = require("sharp");
const url = new URL(process.env.CMS_TEST_DATABASE_URL || "");
if (!["localhost", "127.0.0.1"].includes(url.hostname) || !url.pathname.startsWith("/cms_")) throw Error("A separate local cms_ test database is required.");
const db = new PrismaClient({ datasources: { db: { url: url.href } } });
const build = path.resolve(process.env.CMS_TEST_BUILD || ".");
const port = Number(process.env.CMS_TEST_PORT || 4439), base = "http://localhost:" + port;
const adminPassword=randomUUID(), counselorPassword=randomUUID(), token="CMS QA "+randomUUID();
let server,browser,phase="startup";
async function main(){
 const existing=await db.$queryRaw`SELECT count(*)::int AS n FROM cms_documents`;
 if(existing[0].n)throw Error("Use a fresh test database with an empty CMS.");
 const env={...process.env,NODE_ENV:"production",DATABASE_URL:url.href,ADMIN_EMAIL:"qa@example.invalid",ADMIN_PASSWORD:adminPassword,SESSION_SECRET:randomUUID(),COUNSELOR_PASSWORD:counselorPassword,VERCEL:"",CLOUDINARY_CLOUD_NAME:"",WORDPRESS_API_URL:"http://127.0.0.1:59888/wp-json/wp/v2"};
 server=spawn(process.execPath,[require.resolve("next/dist/bin/next",{paths:[build]}),"start","-H","127.0.0.1","-p",String(port)],{cwd:build,env,windowsHide:true,stdio:"ignore"});
 for(let i=0;i<80;i++){try{if((await fetch(base+"/admin/login")).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 browser=await chromium.launch({headless:true,executablePath:process.env.CMS_TEST_BROWSER || undefined});
 const context=await browser.newContext();await context.route("**/*",r=>new URL(r.request().url()).origin===base?r.continue():r.abort());const p=await context.newPage();p.setDefaultTimeout(30000);p.on("dialog",d=>d.accept());
 const cms="/admin/website-content", preview=cms+"/preview/home/page";
 async function sign(page,email,password){await page.goto(base+"/admin/login");await page.locator("input[type=email]").fill(email);await page.locator("input[type=password]").fill(password);const [reply]=await Promise.all([page.waitForResponse(r=>r.url().endsWith("/api/admin/sign-in")),page.locator("button[type=submit]").click()]); const auth=await reply.json();assert.equal(auth.success,true,"Login: "+auth.message);await page.waitForURL(u=>u.pathname==="/admin",{waitUntil:"domcontentloaded"});}
 async function button(name){const tabs={"Homepage":"home","About us":"about","Contact information":"contact","Courses":"course","Trainers":"trainer","Gallery":"gallery","Testimonials":"testimonial","Placements":"placement","Page SEO":"seo","Media library":"media","Publishing history":"history"};if(tabs[name]){await p.getByLabel("Content workspace").selectOption(tabs[name]);return;}const b=p.getByRole("button",{name,exact:true});await b.waitFor();await b.focus();await b.press("Enter");}
 async function status(msg){await p.getByRole("status").filter({hasText:msg}).waitFor();}
 async function visible(pathname,needle,expected=true){for(let i=0;i<15;i++){const response=await fetch(base+pathname);assert.equal(response.status,200,pathname);if((await response.text()).includes(needle)===expected)return;await new Promise(r=>setTimeout(r,300));}throw Error("Wrong public content at "+pathname);}
 async function save(){await button("Save draft");await status("Draft saved.");}
 async function publish(){await button("Publish");await status("Published.");}
 phase="authorization";for(const target of [cms,preview]){const r=await fetch(base+target,{redirect:"manual"});assert([303,307,308].includes(r.status));}
 const unauth=await fetch(base+"/api/cms/media",{method:"POST",headers:{Origin:base},body:"bad"});assert.equal(unauth.status,403);
 const staff=await browser.newPage();await sign(staff,"counselor@seeyam.com",counselorPassword);await staff.goto(base+cms);assert(!(await staff.getByRole("button",{name:"Save draft"}).count()));await staff.close();
 phase="admin login";await sign(p,"qa@example.invalid",adminPassword);await p.getByRole("link",{name:"Website Content"}).click();
 phase="draft isolation";await p.getByLabel("Hero introduction",{exact:true}).fill(token);await save();await visible("/",token,false);
 const pv=await context.newPage();await pv.goto(base+preview);await pv.locator(".hero-section p").filter({hasText:token}).waitFor();await pv.close();
 phase="publish";await publish();await visible("/",token);await p.getByLabel("Hero introduction",{exact:true}).fill(token+" revised");await save();await visible("/",token+" revised",false);
 phase="unpublish";await button("Unpublish");await status("Unpublished.");await visible("/",token,false);
 phase="media upload";await button("Media library");
 const image=await sharp({create:{width:50,height:50,channels:3,background:"blue"}}).png().toBuffer();
 const upload=async(bytes,name)=>context.request.post(base+"/api/cms/media?name="+name,{headers:{origin:base},data:bytes});
 assert.equal((await upload(Buffer.from("invalid image"),"bad.png")).status(),400);
 assert.equal((await upload(Buffer.alloc(4200000),"large.png")).status(),413);
 await p.locator('input[type=file]').setInputFiles({name:"qa.png",mimeType:"image/png",buffer:image});await button("Upload image");await status("Image uploaded");
 const [asset]=await db.$queryRaw`SELECT id FROM cms_media WHERE name='qa.png'`;assert(asset);
 const assetPath="/api/cms/media/"+asset.id;assert.equal((await fetch(base+assetPath)).status,404);assert.equal((await context.request.get(base+assetPath)).status(),200);
 phase="gallery";await button("Gallery");await p.getByLabel("Image title").fill(token);await p.getByLabel("Alternative text").fill("QA image");await p.getByLabel("Gallery category").fill("Training");await p.getByLabel("Choose library image for Gallery image").selectOption(assetPath);await save();await publish();await visible("/gallery",token);assert.equal((await fetch(base+assetPath)).status,200);
 phase="used image retention";await button("Media library");await button("Delete unused image");await status("Unable to delete");
 phase="replace media";const replacement=await upload(image,"replacement.png");assert.equal(replacement.status(),201);const replacementId=(await replacement.json()).id;await p.reload();await button("Media library");const sourceCard=p.locator("article").filter({has:p.getByRole("img",{name:"qa.png",exact:true})});await sourceCard.locator("select").selectOption(replacementId);await status("saved draft(s) updated");assert.equal((await fetch(base+assetPath)).status,200);await button("Gallery");await publish();assert.equal((await fetch(base+assetPath)).status,404);assert.equal((await fetch(base+"/api/cms/media/"+replacementId)).status,200);await button("Media library");await sourceCard.getByRole("button",{name:"Delete unused image"}).click();await status("Image deleted.");
 phase="course";await button("Courses");await p.locator('aside button').filter({hasText:/^Add /}).click();await p.getByLabel("Course title").fill(token);await p.getByLabel("URL slug").fill("cms-qa-course");await p.getByLabel("Category",{exact:false}).selectOption({index:1});await p.getByLabel("Description",{exact:false}).fill("Course description");await p.getByRole("textbox",{name:"Duration *",exact:true}).fill("6 weeks");await p.getByLabel("Fees").fill("5000");await save();assert.equal(await db.course.count({where:{slug:"cms-qa-course"}}),0);await publish();await visible("/courses/cms-qa-course",token);await button("Archive course");await status("Unpublished.");assert.equal((await fetch(base+"/courses/cms-qa-course")).status,404);
 phase="about";await button("About us");await p.getByLabel("Company introduction").fill(token+" about");await save();await publish();await visible("/about",token+" about");
 phase="contact";await button("Contact information");await p.getByLabel("Address",{exact:true}).fill(token+" address");await save();await publish();await visible("/contact",token+" address");
 phase="trainer";await button("Trainers");await p.locator("aside button").filter({hasText:/^Add /}).click();await p.getByLabel("Trainer name").fill(token+" trainer");await save();await publish();await visible("/trainers",token+" trainer");await visible("/about",token+" trainer");
 phase="testimonial";await button("Testimonials");await p.locator("aside button").filter({hasText:/^Add /}).click();await p.getByLabel("Student name").fill(token+" student");await p.getByLabel("Headline").fill(token+" feedback");await p.getByLabel("Feedback",{exact:false}).fill("Student feedback");await p.locator("form select").nth(0).selectOption({index:1});await p.locator("form select").nth(1).selectOption({index:1});await p.getByLabel("Rating").fill("5");await save();await publish();await visible("/reviews",token+" feedback");await button("Unpublish");await status("Unpublished.");await visible("/reviews",token+" feedback",false);
 phase="placements";await button("Placements");await p.locator("aside button").filter({hasText:/^Add /}).click();await p.getByLabel("Student name").fill(token+" placed");await p.getByLabel("Company").fill("Test company");await p.getByLabel("Job role").fill("Developer");await p.getByLabel("Placement date").fill("2026-01-01");await save();await publish();await visible("/placements",token+" placed");
 phase="seo";await button("Page SEO");await p.getByLabel("Meta title",{exact:true}).fill(token+" SEO");await save();await publish();await visible("/",token+" SEO");await button("Unpublish");await status("Unpublished.");await visible("/",token+" SEO",false);
 const publicPage=await browser.newPage();await publicPage.route("**/*",r=>new URL(r.request().url()).origin===base?r.continue():r.abort());for(const [route,text] of [["/about",token+" about"],["/contact",token+" address"],["/trainers",token+" trainer"],["/gallery",token],["/placements",token+" placed"]]){await publicPage.goto(base+route,{waitUntil:"domcontentloaded"});await publicPage.getByText(text,{exact:true}).first().waitFor();}await publicPage.close();
 phase="editor groups";for(const group of ["About us","Contact information","Trainers","Testimonials","Placements","Page SEO"]){await button(group);await p.getByRole("button",{name:"Save draft",exact:true}).waitFor();}
 phase="mobile";await p.setViewportSize({width:390,height:844});await button("Homepage");assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 phase="public routes";for(const route of ["/","/about","/courses","/gallery","/trainers","/placements","/reviews","/contact"]){assert.equal((await fetch(base+route)).status,200,route);}
 const [audit]=await db.$queryRaw`SELECT count(*)::int AS n FROM cms_history`;assert(audit.n>=5);
 console.log("Passed: sign-in, staff restrictions, private preview, draft isolation, publish/unpublish, gallery, image validation/access, course publication/archive, audit history, mobile CMS and public routes.");
}
main().catch(e=>{console.error(phase,e.message);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.kill();await db.$disconnect();});
