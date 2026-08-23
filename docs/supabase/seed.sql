-- DEVELOPMENT FIXTURES ONLY. Do not run in production without editorial review.
insert into categories(name,slug,description,sort_order) values
('Finance & Markets','finance-markets','Finance, markets, and the economy.',10),('Tech & AI','tech-ai','Technology and artificial intelligence.',20),
('Science & Future','science-future','Science, energy, and what comes next.',30),('Pulse','pulse','Internet culture and emerging conversations.',40)
on conflict(slug) do update set name=excluded.name,description=excluded.description;
insert into tags(name,slug) values ('Mortgage rates','mortgage-rates'),('Refinancing','refinancing'),('AI tools','ai-tools'),('Automation','automation'),('Green energy','green-energy'),('EVs','evs'),('Viral trends','viral-trends'),('Creator economy','creator-economy') on conflict(slug) do nothing;
insert into authors(name,slug,email,position,bio) values ('The Major Insight Desk','major-insight-desk','fixtures@example.invalid','Editorial team','Development fixture author. Replace before production.') on conflict(slug) do nothing;
insert into posts(title,slug,excerpt,content,content_type,category_id,author_id,status,published_at,reading_time_minutes,focus_keyword,is_featured)
select 'Fixture: Current Mortgage Rate Trends','fixture-current-mortgage-rate-trends','Development-only sample post. Remove or replace before launch.',
'{"paragraphs":["This clearly identified fixture verifies the production article query and safe JSON rendering."],"key_takeaways":["This is sample content, not financial advice."]}'::jsonb,
'Analysis',c.id,a.id,'published',now(),2,'mortgage rate trends',true from categories c cross join authors a where c.slug='finance-markets' and a.slug='major-insight-desk'
on conflict(slug) do nothing;
insert into post_sources(post_id,label,url,sort_order) select p.id,'Fixture source','https://example.com/',0 from posts p where p.slug='fixture-current-mortgage-rate-trends' and not exists(select 1 from post_sources s where s.post_id=p.id);
