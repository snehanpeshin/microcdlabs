import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = fs.readFileSync(path.join(root, 'services.html'), 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const pages = [
  {
    slug: 'microfluidic-consulting', name: 'Microfluidic consulting', purpose: 'microfluidic-development',
    title: 'Microfluidic Consulting & Design Support | MicroCD Labs',
    description: 'Scope a microfluidic architecture, sample-handling workflow, or lab-on-disc development plan with clear inputs, assumptions, and engineering deliverables.',
    intro: 'Turn an assay or sample-handling question into a fluidic architecture and a practical development plan. Start with the decision your team needs to make, then agree on the work product.',
    problem: 'An application may be clear while the route through a device is not. Sample preparation, fluid sequencing, interfaces, materials, and the measurement step need to work together. Consulting can help separate the decisions that can be made from existing evidence from the questions that require an experiment.',
    outputs: ['A requirements and constraints brief covering volumes, fluids, interfaces, and the intended workflow.', 'A functional block diagram or sample-to-readout workflow with stated assumptions.', 'A comparison of candidate architectures, components, or material routes against agreed criteria.', 'A prototype and experiment roadmap identifying the next uncertainty to resolve.'],
    inputs: ['A non-confidential description of the application and current assay steps.', 'Known sample and reagent volumes, fluid properties, and compatibility constraints.', 'Existing sketches, bench observations, or test data, if available.', 'The next decision, development stage, and desired deliverable.'],
    decisions: [
      ['Sample handling', 'Which collection, preparation, transfer, and containment steps belong in the proposed workflow?'],
      ['Fluid sequencing', 'How should mixing, incubation, separation, and measurement be ordered, and what drives the fluid?'],
      ['Prototype evidence', 'What small experiment would distinguish two candidate architectures before a larger build?']
    ],
    evidence: ['modeler/', 'Inspect the Microfluidic Modeler', 'The browser-based research tool supports early 2D flow-path exploration. It is a development aid, not a fabrication-ready model or proof of a customer outcome.'],
    faq: [
      ['Can we begin before the device requirements are complete?', 'Yes. A focused requirements or feasibility brief can be the initial work product. Open questions and assumptions should remain explicit.'],
      ['Does consulting include chip fabrication?', 'Fabrication is not automatically included. Any prototype route, supplier role, build responsibility, and acceptance criteria must be agreed in the project scope.'],
      ['Can you help with lab-on-disc workflows?', 'Lab-on-disc and centrifugal workflows are within the technical focus. The scope can address sequence maps, interfaces, and prototype planning; performance must be established through testing.']
    ]
  },
  {
    slug: 'diagnostic-cartridge-design', name: 'Diagnostic cartridge design', purpose: 'diagnostic-cartridge',
    title: 'Diagnostic Cartridge Design & Development | MicroCD Labs',
    description: 'Define a diagnostic cartridge workflow, sample and reagent interfaces, disposable architecture, and prototype evidence plan with MicroCD Labs.',
    intro: 'Connect the assay workflow to the disposable device. Define sample and reagent handling, reader interfaces, and the evidence a cartridge prototype needs to produce.',
    problem: 'Moving a manual assay into a cartridge changes more than its geometry. User steps, volumes, timing, material compatibility, controls, and the reader interface become connected design decisions. An architecture brief can make these dependencies visible before detailed CAD or supplier handoff.',
    outputs: ['A sample-to-readout workflow and functional cartridge architecture.', 'A map of sample, reagent, waste, optical, and mechanical interfaces relevant to the proposed device.', 'A requirements and risk-question register connecting design assumptions to evidence gaps.', 'A prototype roadmap with bench checks and proposed review criteria.'],
    inputs: ['A non-confidential assay protocol and intended research or development use.', 'Sample type, reagent needs, incubation steps, and available bench evidence.', 'Known reader, optical, mechanical, or manufacturing constraints.', 'The current development stage and decision that the cartridge design must support.'],
    decisions: [
      ['Disposable workflow', 'What does the user do, what does the device do, and where could an invalid sample or failed step go unnoticed?'],
      ['Assay and reader interfaces', 'Which fluidic volumes, optical regions, mechanical alignments, and timing requirements must be defined together?'],
      ['Verification planning', 'Which proposed checks can establish transfer, containment, sequence, or readout behavior at the prototype stage?']
    ],
    evidence: ['clair/#clair-workflow', 'Review the CLAIR development workflow', 'CLAIR illustrates an in-development centrifugal platform and its open evidence questions. It is not a validated cartridge, a commercial diagnostic, or a customer case study.'],
    faq: [
      ['Does cartridge design include assay validation or regulatory approval?', 'No. Assay validation, clinical evaluation, regulatory strategy, and approvals are separate workstreams. The agreed scope must state the intended use and evidence boundaries.'],
      ['Can a manual assay be the starting point?', 'Yes. A manual workflow and its bench observations can be used to identify cartridge functions, interfaces, and experiments. Transfer into a device does not establish equivalent performance.'],
      ['Will the first deliverable be a production-ready cartridge?', 'Not by default. Early work may be an architecture or prototype brief. Detailed design, manufacturing responsibility, verification, and release criteria require their own agreed scope.']
    ]
  },
  {
    slug: 'engineering-prototyping', name: 'Engineering design & prototyping', purpose: 'engineering-design',
    title: 'Engineering Design & Prototyping Support | MicroCD Labs',
    description: 'Get scoped CAD, interface drawings, fixture requirements, and prototype planning for microfluidic, diagnostic, and laboratory development projects.',
    intro: 'Give a concept the mechanical definition it needs for the next build or test. Scope the CAD, interfaces, fixtures, and supplier questions around a specific development decision.',
    problem: 'A prototype is useful when it answers a question. Before creating detailed geometry, define the interfaces it must represent, the loads or operating conditions it will encounter, and the result the team needs to inspect. That keeps modeling and fabrication effort tied to the project decision.',
    outputs: ['Concept CAD and interface drawings within an agreed model and drawing scope.', 'Fixture requirements or mechanical layouts for a defined bench task.', 'A build-and-test plan with material and fabrication assumptions.', 'A technical handoff package containing the agreed files, vendor questions, and open issues.'],
    inputs: ['Existing sketches, models, drawings, or photographs that you are permitted to share.', 'Critical interfaces, approximate envelope, operating conditions, and known constraints.', 'The proposed fabrication route or supplier requirements, if already chosen.', 'The test or decision the prototype should support and the required handoff format.'],
    decisions: [
      ['Interfaces and fit', 'Which dimensions, alignment features, connections, and service access must be represented in the prototype?'],
      ['Build route', 'What can the chosen fabrication process demonstrate, and which properties will still need a later build or test?'],
      ['Test and handoff', 'What will be inspected, how will it be assessed, and which files and open questions must accompany the handoff?']
    ],
    evidence: ['about.html#motor-controller-title', 'Inspect the motor-profile development example', 'The existing motor-profile software demonstrates control interfaces and bench communication. It is engineering evidence, not a claim about a completed customer prototype or certified controller.'],
    faq: [
      ['Can we request a small, defined piece of CAD work?', 'Yes. The engagement can be scoped around a model, interface drawing, fixture brief, or technical review. Inputs, revisions, outputs, and review criteria should be agreed first.'],
      ['Does prototyping support mean in-house manufacturing?', 'No. Fabrication routes and suppliers are defined per project. In-house manufacturing, certified production, or supplier availability are not implied.'],
      ['Can an existing design be reviewed?', 'Yes. A review can focus on interfaces, assumptions, missing requirements, or the questions a prototype should resolve. Production readiness requires the evidence and controls appropriate to the intended application.']
    ]
  }
];

for (const page of pages) {
  const url = `https://www.microcdlabs.com/${page.slug}.html`;
  const enquiry = `consultation.html?project=${page.purpose}#inquiry-title`;
  let head = base.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/(<meta\s+(?:name="description"|property="og:description")\s+content=")[^"]*("\s*\/>)/g, `$1${escape(page.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(page.title)}`)
    .replaceAll('https://www.microcdlabs.com/services.html', url);
  const schema = {'@context': 'https://schema.org', '@graph': [
    {'@type': 'Service', '@id': `${url}#service`, name: page.name, description: page.description, url,
      provider: {'@type': 'Organization', '@id': 'https://www.microcdlabs.com/#organization', name: 'MicroCD Labs', url: 'https://www.microcdlabs.com/'}},
    {'@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.microcdlabs.com/'},
      {'@type': 'ListItem', position: 2, name: 'Engineering services', item: 'https://www.microcdlabs.com/services.html'},
      {'@type': 'ListItem', position: 3, name: page.name, item: url}
    ]}
  ]};
  head += `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  const header = base.match(/<header class="site-header">[\s\S]*?<\/header>/)[0]
    .replaceAll('consultation.html?project=microfluidic-development#inquiry-title', enquiry);
  const footer = base.match(/<footer class="site-footer[\s\S]*?<\/footer>/)[0];
  const list = values => '<ul>' + values.map(value => `<li>${escape(value)}</li>`).join('') + '</ul>';
  const html = `<!doctype html>
<html lang="en"><head>${head}</head><body class="mcd-custom mcd-capabilities">
${header}
<main id="main-content">
<nav class="mcd-chapters" aria-label="Breadcrumb"><a href="index.html">Home</a><a href="services.html">Engineering services</a><span>${escape(page.name)}</span></nav>
<section class="review-hero"><div><p class="eyebrow">Scoped engineering support</p><h1>${escape(page.name)}</h1><p class="review-hero-copy">${escape(page.intro)}</p><div class="hero-actions"><a class="button button-ghost-light" href="${enquiry}">Discuss your project ↗</a><a class="button button-ghost-light" href="#deliverables">Explore deliverables</a></div><p class="review-status">Scope, responsibilities, timing, and fees are agreed before paid work begins.</p></div></section>
<section class="mcd-section" id="deliverables"><div class="mcd-section-heading"><p class="eyebrow">The engineering question</p><h2>A work product tied to your next decision.</h2><p>${escape(page.problem)}</p></div><div class="review-program-grid"><article class="review-program"><h3>Example work products</h3>${list(page.outputs)}<p>These are examples, not a bundled commitment. The agreed scope defines the actual outputs and review criteria.</p></article><article class="review-program"><h3>Useful starting inputs</h3>${list(page.inputs)}<p>Share non-confidential information in the initial enquiry. A finished specification is not required.</p></article></div></section>
<section class="mcd-section review-flow-section"><div class="mcd-section-heading"><p class="eyebrow">Decisions to make explicit</p><h2>Questions the work can help resolve.</h2></div><div class="review-evidence-grid">${page.decisions.map(([name, text]) => `<article><h3>${escape(name)}</h3><p>${escape(text)}</p></article>`).join('')}</div></section>
<section class="mcd-section"><div class="mcd-section-heading"><p class="eyebrow">Development work you can inspect</p><h2>Explore the technical context.</h2><p>${escape(page.evidence[2])}</p><a class="text-link" href="${page.evidence[0]}">${escape(page.evidence[1])} ↗</a></div></section>
<section class="mcd-section review-flow-section" aria-labelledby="questions"><div class="mcd-section-heading"><p class="eyebrow">Before we begin</p><h2 id="questions">Common project questions.</h2></div>${page.faq.map(([q, a]) => `<details class="review-disclosure"><summary>${escape(q)}</summary><div><p>${escape(a)}</p></div></details>`).join('')}</section>
<section class="mcd-section"><div class="mcd-section-heading"><p class="eyebrow">Start a conversation</p><h2>Describe the question. Define the next step.</h2><p>Send a short technical brief with the current stage, constraints, and result you need. We will review your enquiry and follow up by email.</p><a class="button button-primary" href="${enquiry}">Discuss ${escape(page.name.toLowerCase())}</a></div><nav class="mcd-chapters" aria-label="Related engineering services">${pages.filter(other => other.slug !== page.slug).map(other => `<a href="${other.slug}.html">${escape(other.name)}</a>`).join('')}<a href="services.html">All engineering services</a></nav></section>
</main>${footer}<script src="site.js?v=20261116-lead-journey"></script><script src="assets/chat-widget.js?v=20261106"></script></body></html>
`;
  fs.writeFileSync(path.join(root, `${page.slug}.html`), html);
}
console.log(`Generated ${pages.length} focused engineering service pages.`);
