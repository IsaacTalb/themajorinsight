import assert from "node:assert/strict";
import test from "node:test";
import { editorialWarnings, makeSlug, sanitizeArticleHtml } from "./editorial";
test("creates valid editable slugs",()=>assert.equal(makeSlug("The AI Economy: What’s Next?"),"the-ai-economy-what-s-next"));
test("sanitizes hostile article markup",()=>{const html=sanitizeArticleHtml('<p onclick="steal()">Safe</p><script>alert(1)</script><a href="javascript:bad()">bad</a>');assert.equal(html,"<p>Safe</p><a>bad</a>");});
test("publication checklist finds incomplete work",()=>{const warnings=editorialWarnings({title:"Draft",slug:"Bad Slug",authorId:"",bodyHtml:"<p>short</p>",featuredImageUrl:"https://x.test/i.jpg",featuredImageAlt:"",seoDescription:"",sources:[],scheduledAt:"2020-01-01"});assert.deepEqual(warnings,["Missing author","Missing sources","Missing featured-image alt text","Empty SEO description","Invalid slug","Scheduled date is in the past","Unfinished content"]);});
