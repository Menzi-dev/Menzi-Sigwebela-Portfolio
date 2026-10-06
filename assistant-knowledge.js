/* Portfolio-backed assistant. Public portfolio facts only; no external API or invented details. */
(() => {
 const clean = value => (value || '').replace(/\s+/g,' ').trim();
 const normal = value => clean(value).toLowerCase().replace(/[\u2018\u2019]/g,"'");
 const read = (root, selector) => clean(root?.querySelector(selector)?.textContent);
 const records = [];
 const add = (id, title, aliases, text, facets = {}, source = '#about') => records.push({id,title,aliases,text,facets,source});
 document.querySelectorAll('#projects-overlay .archive-case').forEach(card => {
  const id=card.dataset.archive;
  const aliases={campus:['campusconnect','campus connect','campus ride','ride sharing','ride-sharing'],safari:['safari wheels','safari','car rental','vehicle rental'],taste:['urban style','taste heaven','restaurant'],fashion:['neliswa','client portfolio','fashion designer','fashion portfolio'],durban:['durbanfix','durban fix','municipal','fault reporting'],network:['enterprise network','cisco','network topology','packet tracer']}[id];
  const title=read(card,'h3'), desc=read(card,'.proj-desc'), status=read(card,'.archive-status');
  const links=Array.from(card.querySelectorAll('.proj-links a')).map(a=>`${clean(a.textContent)}: ${a.href}`).join('\n');
  add(id,title,aliases,`${title}: ${desc}\n\nStatus: ${status}`,{
   stack: Array.from(card.querySelectorAll('.proj-stack li')).map(e=>clean(e.textContent)).join(', '),
   features: Array.from(card.querySelectorAll('.proj-features li')).map(e=>'- '+clean(e.textContent)).join('\n'),
   metrics: Array.from(card.querySelectorAll('.proj-highlight')).map(e=>`${read(e,'.num')}: ${read(e,'.lbl')}`).join('\n'),
   links,status
  },'projects');
 });
 document.querySelectorAll('#about-overlay .cert-card').forEach((card,i)=>{
  const title=read(card,'h4'), paragraphs=Array.from(card.querySelectorAll('.cert-card-body p')).map(e=>clean(e.textContent));
  const aliases=[normal(title)];
  if(i===0)aliases.push('azure','microsoft','az-900','az900','cloud certification');
  if(i===1)aliases.push('ibm','data science methodology');
  if(i===2)aliases.push('gkhack','gkhack25','hackathon','mzansimavericks','study buddy');
  if(i===3)aliases.push('web development certificate','web credential');
  if(i===4)aliases.push('java certificate','java credential');
  if(i===5)aliases.push('python bootcamp','python training');
  add('cert'+i,title,aliases,`${title}\n${paragraphs.join('\n')}\n${read(card,'.cert-date')}`,{date:read(card,'.cert-date'),issuer:paragraphs[0]},'credentials');
 });
 document.querySelectorAll('#skills .skill-node').forEach(card=>add('skill-'+card.dataset.node,read(card,'h3'),[normal(read(card,'h3'))],`${read(card,'h3')}: ${Array.from(card.querySelectorAll('.skill-tags li')).map(e=>clean(e.textContent)).join(', ')}`,{},'#skills'));
 const education=Array.from(document.querySelectorAll('#about-overlay .edu-year')).map(year=>({title:read(year,'h4'),meta:read(year,'.meta'),subjects:Array.from(year.querySelectorAll('.edu-row')).map(e=>clean(e.textContent))}));
 add('identity','About Menzi',['who is menzi','about menzi','about him','about me','who is he','introduce','background','summary','full name','name','who are you'],"Menzi Sigwebela is a full-stack developer based in South Africa. He is a final-year Diploma in ICT Application Development student at Sol Plaatje University, an academic tutor, and Microsoft Certified: Azure Fundamentals. His portfolio includes six projects across web, mobile and networking. He is open to graduate and internship opportunities.");
 add('education','Education',['education','university','qualification','diploma','college','study','studies','graduated','graduate date'],"Menzi is completing a Diploma in ICT: Application Development at Sol Plaatje University in South Africa. His final year is in progress; the portfolio does not list a confirmed graduation date. He plans to pursue an Advanced Diploma.",{},'education');
 add('grades','Academic record',['average','marks','grades','credits','distinctions','academic results'],read(document.querySelector('#about-overlay'),'.edu-progress')+'\n\n'+education.map(e=>`${e.title}: ${e.meta}`).join('\n'),{},'education');
 add('tutor','Academic tutoring',['tutor','tutoring','fasset','mentor','teaching'],"Menzi's FASSET Academic Support Tutor experience involves supporting first-year ICT students with programming, systems concepts and coursework. He adapts explanations to help students understand technical ideas.",{},'#involvement');
 add('leadership','Leadership and teamwork',['leadership','house committee','moroka','residence','community','teamwork','communication'],"Menzi served on the elected Moroka Residence House Committee, representing students and developing communication, teamwork and conflict-resolution skills. His portfolio also describes academic tutoring, Circuit Breakers involvement and GKHack25 participation.",{},'#involvement');
 add('club','Circuit Breakers',['circuit breakers','club'],"Menzi's portfolio lists involvement in Circuit Breakers, SPU's cross-course problem-solving club, as well as Python training through Circuit Breakers / WSU / NEMISA.",{},'#involvement');
 add('contact','Contact',['contact','email','phone','number','whatsapp','reach','linkedin','github','hire'],"Email: menzisigwebela03@gmail.com\nPhone: 083 254 4621\nWhatsApp: https://wa.me/+27832544621\nGitHub: https://github.com/Menzi-dev\nLinkedIn: https://linkedin.com/in/menzi-sigwebela-00035830b\nYou can also use the contact form.",{},'#contact');
 add('location','Location',['location','based','live','city','country','where is he','where does'],"Menzi is based in South Africa.",{},'#contact');
 add('opportunities','Career direction',['opportunities','internship','job','roles','available','career','goals','future','next step'],"Menzi is open to graduate and software development internship roles. His focus is full-stack development, supported by practical projects, academic tutoring and foundational Azure knowledge. He is completing his diploma and plans further study. Start date, salary expectations and relocation preferences are not listed; contact him to discuss them.",{},'#contact');
 add('strengths','Working with Menzi',['strengths','why hire','fit','work ethic','personality','approach','soft skills'],"His portfolio combines full-stack project work with technical communication through first-year tutoring and teamwork through student leadership and hackathon participation. He focuses on connecting interfaces, APIs and data models, supported by design and documentation.");
 document.querySelectorAll('#about-overlay .edu-row').forEach((row,i)=>{
  const title=read(row,'.name'),code=read(row,'.code'),mark=read(row,'.mark');
  add('module'+i,title,[normal(title),normal(code)],`${title} (${code}): ${mark}. This is the academic record currently displayed in the portfolio.`,{},'education');
 });
 let context=null;
 const unknown="That detail isn't in Menzi's public portfolio, so I can't give a reliable answer. You can ask him directly at menzisigwebela03@gmail.com. I can help with his projects, education, skills, credentials, tutoring and career interests.";
 const stop=new Set('a an the is are was were do does did can could would should will what which who how when where why tell me about menzi his he him my you your please and or of in on to for with it that this more details'.split(' '));
 const tokens=text=>normal(text).match(/[a-z0-9+#]+/g)?.filter(t=>!stop.has(t)&&t.length>1)||[];
 const contains=(q,phrase)=>new RegExp('(^|[^a-z0-9])'+phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|[^a-z0-9])','i').test(q);
 function answer(input){
  const q=normal(input), words=tokens(q);
  const result=(text,source=null)=>({text,source});
  if(!q||/^(hi|hello|hey|good (morning|afternoon|evening))[!. ]*$/.test(q))return result("Hi! Ask me about Menzi's projects, Microsoft credential, studies, skills or tutoring. You can also ask follow-up questions like 'What technologies does it use?'");
  if(/^(thanks|thank you|bye|goodbye)[!. ]*$/.test(q))return result("You're welcome! You can reach Menzi through the Contact section.",'#contact');
  if(/\b(age|birthday|birth date|born|girlfriend|boyfriend|married|religion|salary|id number|identity number|password|home address|private|favourite|favorite|hobbies|relocat|start date)\b/.test(q))return result(unknown,'#contact');
  if(/\b(ignore|pretend|invent|make up)\b/.test(q))return result("I can only share information supported by Menzi's portfolio. What would you like to know?");
  if(/\b(ccna|ccnp)\b/.test(q))return result("Menzi's portfolio demonstrates Cisco networking through coursework and an enterprise network simulation. It does not list an earned CCNA or CCNP certification. His listed Microsoft credential is Azure Fundamentals.",'credentials');
  if(/\b(cv|resume|curriculum vitae)\b/.test(q))return result("You can view or download Menzi's CV from the CV section. It covers his education, experience, projects and technical skills.",'#resume');
  if(/\b(certifications|certificates|credentials)\b/.test(q)&&!records.some(r=>r.id.startsWith('cert')&&r.aliases.some(a=>contains(q,a))))return result('His six listed credentials are:\n'+records.filter(r=>r.id.startsWith('cert')).map(r=>'- '+r.title+' / '+r.facets.date).join('\n')+'\n\nThese include certification, training and hackathon participation.','credentials');
  if(/\b(projects|builds)\b/.test(q)&&!records.some(r=>r.facets.stack&&r.aliases.some(a=>contains(q,a))))return result('His six projects are:\n'+records.filter(r=>r.facets.stack).map(r=>'- '+r.title+' / '+r.facets.status).join('\n'),'projects');
  if (/\b(how many|number of)\b/.test(q) && /\b(projects|credentials|certificates)\b/.test(q)) return result(/\b(projects)\b/.test(q)?'Menzi has six projects in this portfolio, spanning web, mobile and networking.':'The portfolio lists six credentials: certification, training and hackathon participation.',/\b(projects)\b/.test(q)?'projects':'credentials');
  const namedProjects=records.filter(r=>r.facets.stack&&r.aliases.some(alias=>contains(q,alias)));
  if(namedProjects.length>1)return result(namedProjects.map(r=>`${r.title}\n${r.text}\nTechnologies: ${r.facets.stack}`).join('\n\n'),'projects');
  const year=education.find(e=>q.includes(e.title.slice(0,4)));
  if(year&&/\b(modules|subjects|marks|grades|results|credits|education|studied)\b/.test(q))return result(`${year.title}: ${year.meta}\n${year.subjects.join('\n')}`,'education');
  const follow=/\b(it|its|that|this|same|more|those)\b/.test(q)||/^(and |what (technologies|features|stack)|where can i|is it)/.test(q);
  let ranked=records.map(r=>{
   const alias=r.aliases.reduce((n,a)=>n+(contains(q,a)?12+tokens(a).length:0),0);
   const rt=new Set(tokens(r.title+' '+r.text));
   const overlap=words.filter(w=>rt.has(w)).length;
   return {r,score:alias+overlap,alias};
  }).sort((a,b)=>b.score-a.score);
  let selected=ranked[0];
  if(follow&&context&&!ranked.some(x=>x.alias>0))selected={r:context,score:12,alias:0};
  if(/\b(skills|tech stack|technologies|programming languages)\b/.test(q)&&!ranked.some(x=>x.r.facets.stack&&x.alias>0)&&!follow)return result(records.filter(r=>r.id.startsWith('skill-')).map(r=>r.text).join('\n')+'\n\nCloud foundation: Microsoft Certified: Azure Fundamentals. These skills are presented through projects and learning, without proficiency ratings.','#skills');
  if(!selected||selected.score<3)return result(unknown,'#contact');
  const r=selected.r;context=r;
  let text=r.text;
  if(r.facets.stack){
   if(/\b(stack|technologies|technology|built with|language|framework|database|backend|frontend)\b/.test(q))text=`${r.title} uses ${r.facets.stack}.\nStatus: ${r.facets.status}`;
   else if(/\b(features|functionality|functions|capabilities|how.*work)\b/.test(q))text=`${r.title} - documented features:\n${r.facets.features}\n\nStatus: ${r.facets.status}`;
   else if(/\b(repo|repository|code|link|url|live|demo|deployed)\b/.test(q))text=`${r.title}\n${r.facets.links}\nStatus: ${r.facets.status}`;
   else if(/\b(metrics|tables|roles|threshold|target|numbers)\b/.test(q))text=`${r.title}\n${r.facets.metrics}\nDesign targets and configured thresholds are not independently measured service results.`;
   else if(/\b(more|detail|everything)\b/.test(q))text+=`\n\nTechnologies: ${r.facets.stack}\n${r.facets.features}`;
  }
  return result(text,r.source);
 }
 window.PortfolioAssistant={answer,reset:()=>{context=null;},recordCount:records.length};
})();
