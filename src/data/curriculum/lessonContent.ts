import type {
  CodeExample,
  Comparison,
  LessonSection,
  LessonSummary,
  PracticalChallenge,
} from '../../types/curriculum.ts'

/** Prose and exercises for published lessons. Planned lessons have none yet. */
export const lessonSections: LessonSection[] = [
  {
    id: 'section-1-1-1',
    order: 1,
    title: 'Why Should You Learn System Design?',
    kind: 'introduction',
    paragraphs: [
      'Imagine an online store that starts with 10 users, 100 products, one application server and one database. At this size, correct code and a simple deployment can be enough. Design is still happening, but it can stay informal.',
      'Now imagine the same store serving 100,000 users, millions of products and thousands of simultaneous requests. A query that felt instant can become slow. One server can become a bottleneck. A bug or a deploy can affect every customer.',
      'System design is the practice of deciding how the parts of an application fit together so it keeps working as needs change. Correct code is necessary, but code alone does not answer how traffic is distributed, where data is stored, what happens when a dependency fails, or how the system will be changed later.',
      'This lesson does not claim that every small application needs a distributed architecture. The goal is to recognise when a simple architecture is a deliberate choice and when growth calls for a different conversation.',
    ],
    keyPoints: [
      'Small systems can succeed with simple architecture.',
      'Growth changes traffic, data, failure and change-management problems.',
      'Writing correct code is necessary but not sufficient for a successful system.',
    ],
  },
  {
    id: 'section-1-1-2',
    order: 2,
    title: 'What Is System Design?',
    kind: 'concepts',
    paragraphs: [
      'System design is the process of defining how software components work together to satisfy requirements and constraints. Components are the parts that perform work. Responsibilities describe what each part owns. Communication describes how parts exchange information. Data flow describes where information goes. Storage describes what survives between requests. Infrastructure is the environment that runs and connects everything.',
      'A design also records architectural decisions: which component owns each responsibility, which paths requests take, what happens on failure, and which trade-offs are acceptable. Requirements say what the system must do and how well. Constraints limit the choices, such as budget, team size, deadlines or existing technology.',
      'Coding implements individual features and algorithms inside a chosen structure. System design decides the structure itself. For an online store, coding might implement a product search function. System design decides whether search runs in the application server, uses a separate search index, needs a cache, and how product data stays correct when it changes.',
    ],
    keyPoints: [
      'Design is about structure, interaction and constraints, not a list of technologies.',
      'Coding asks how to implement a feature; system design asks how the parts work together.',
      'A design should be explainable before it is implemented.',
    ],
  },
  {
    id: 'section-1-1-3',
    order: 3,
    title: 'A Real-World Analogy',
    kind: 'concepts',
    paragraphs: [
      'A restaurant is a useful analogy because many people must cooperate to complete an order. Customers place requests. Waiters carry orders and responses. The kitchen prepares the product. Storage holds ingredients. A payment step records the transaction. Coordination makes sure the right order reaches the right table.',
      'The mapping is straightforward: customers are clients; waiters resemble the API and request path; the kitchen is the application server executing logic; storage is the database; a small counter of popular ready-to-serve items behaves like a cache; the payment step is part of the business workflow; the manager coordinating staff resembles infrastructure and operational process.',
      'The analogy helps explain responsibilities and handoffs: no single person does everything, and the connections between people matter. It has limits. Software can be copied instantly, requests can arrive concurrently at enormous scale, and a server can fail and restart in ways a kitchen cannot. Use the analogy to build intuition, then return to the technical model.',
    ],
    keyPoints: [
      'The analogy shows why responsibilities and handoffs matter.',
      'It is not a technical specification.',
      'Return to precise component names when designing software.',
    ],
  },
  {
    id: 'section-1-1-4',
    order: 4,
    title: 'Main Building Blocks of a Software System',
    kind: 'concepts',
    paragraphs: [
      'A client is the application or device that initiates a request: a browser, mobile app, command-line tool or another service. It represents the user or caller and gives people an interface to the system. For example, a shopper’s browser requests a product page.',
      'A server receives requests and runs application logic. It exists to apply rules that should not live in the client, such as checking prices or validating orders. It solves the problem of centralising behaviour and data access. For example, the store server calculates the final basket total.',
      'An API, or application programming interface, is the contract between components: the allowed requests, expected data and response format. It exists so components can collaborate without sharing internal code. It solves the problem of unclear handoffs. For example, GET /products/42 returns one product as JSON.',
      'A database stores and retrieves persistent data that must survive restarts. It solves the problem of losing important state when a process ends. For example, the product catalogue and placed orders live in a database.',
      'A cache is a faster storage layer that keeps a copy of data or a computed result so repeated expensive work can be avoided. It reduces repeated reads and latency, but it can serve stale data until it is refreshed or invalidated. For example, recently viewed product details can be kept in a cache.',
      'A load balancer distributes incoming traffic across multiple servers. It prevents one server from receiving every request and can keep a service reachable when one instance fails. For example, product-page requests can be spread across two application servers.',
      'A message queue allows work to be communicated and processed asynchronously: one component places a message, and another processes it later. It reduces coupling and absorbs bursts for work that need not finish during the original request. For example, an order confirmation email can be sent after checkout responds.',
    ],
    keyPoints: [
      'Clients request, servers decide, APIs define the contract and databases remember.',
      'Caches speed repeated reads, load balancers spread traffic and queues defer work.',
      'These components are optional; add one only when a requirement or measured problem justifies it.',
      'Every component adds responsibility and operational cost.',
    ],
  },
  {
    id: 'section-1-1-5',
    order: 5,
    title: 'How Components Work Together',
    kind: 'process',
    paragraphs: [
      'A product page request is a good example of data flow: the client asks for information, the server applies rules, and a response returns. The first diagram after this section shows the simplest version of that path.',
      'A request is the message sent by the caller. A response is the result returned. Data flow is the route information takes. Component responsibility is the work each part owns. Keeping these ideas separate makes a design easier to reason about.',
    ],
    steps: [
      {
        id: 'step-1-1-5-1',
        title: 'Client sends a request',
        description: 'The browser sends GET /products/42 to the store API because the shopper opened that product page.',
      },
      {
        id: 'step-1-1-5-2',
        title: 'Request reaches the server',
        description: 'The network delivers the request to the application server, which validates the route and the product id.',
      },
      {
        id: 'step-1-1-5-3',
        title: 'Server processes the request',
        description: 'The server applies business rules, such as checking that the product is active and visible to customers.',
      },
      {
        id: 'step-1-1-5-4',
        title: 'Server checks the cache',
        description: 'The server looks for a recent copy of product 42. If it is present, this read can skip the database.',
      },
      {
        id: 'step-1-1-5-5',
        title: 'Server queries the database if needed',
        description: 'On a cache miss, the server reads the durable product data and may store a copy in the cache for later reads.',
      },
      {
        id: 'step-1-1-5-6',
        title: 'Server prepares the response',
        description: 'The server formats the product data as a response with a status, headers and a JSON body.',
      },
      {
        id: 'step-1-1-5-7',
        title: 'Client displays the product',
        description: 'The browser renders the name, price and image. The request ends, while durable data remains in the database.',
      },
    ],
    keyPoints: [
      'Not every request touches every component.',
      'A cache hit avoids a database read; a cache miss allows one.',
      'Name responsibilities explicitly instead of saying that the system handles it.',
    ],
  },
  {
    id: 'section-1-1-6',
    order: 6,
    title: 'Functional Requirements',
    kind: 'concepts',
    paragraphs: [
      'Functional requirements describe what a system must do: the capabilities and behaviour that a user or another system can observe. They are written from the outside, not from the implementation.',
      'For our store, the initial functional requirements include: users can register; users can log in; users can browse products; users can add products to a basket; users can place orders; and users can track orders.',
      'Clear requirements are testable. “A registered user can place an order containing items that are currently in stock” can be checked. “The store should work well” cannot. Vague requirements hide decisions and make validation difficult.',
    ],
    keyPoints: [
      'Functional means behaviour or capability.',
      'Write an actor, an action and an observable result.',
      'Prefer testable statements over adjectives.',
    ],
  },
  {
    id: 'section-1-1-7',
    order: 7,
    title: 'Non-Functional Requirements',
    kind: 'concepts',
    paragraphs: [
      'Performance describes how quickly the system responds and how much work it processes. For example, a product page might be required to return within 200 ms at a stated request rate. It matters because slow systems feel broken even when they are functionally correct. Performance is not only a database issue; network time, code, cache misses and contention can all contribute.',
      'Scalability is the ability to handle increasing workload by adding resources without redesigning everything. For example, the store might need to serve 10,000 concurrent users by adding application instances and caching product reads. Scalability does not automatically mean microservices; a well-structured monolith can scale for many workloads.',
      'Availability is how consistently the system remains accessible, often expressed as a target such as 99.9% over a period. For example, customers might still browse cached products when one application instance fails. Availability does not mean that components never fail; good designs expect failure and keep the service reachable.',
      'Reliability is how consistently the system behaves correctly over time. For example, an order should be recorded once and a customer should not be charged twice. Reliability matters because silent wrong results can be worse than visible downtime. Availability asks whether users can reach the system; reliability asks whether its results are correct. A service can be available while returning the wrong order total.',
      'Security protects users, data and operations. For example, passwords are hashed, payment data is encrypted in transit, and customers can see only their own orders. Security is not a final checklist; it shapes APIs, storage and deployment from the start.',
      'Maintainability is how easily developers can understand, modify and extend the system. For example, a new developer should be able to locate order logic and add a delivery status without reading unrelated code. It includes clear ownership, documentation and simple operational procedures, not just tidy source code.',
    ],
    keyPoints: [
      'Non-functional requirements describe qualities: how well the system behaves.',
      'Availability asks Can users reach it? Reliability asks Does it behave correctly?',
      'These requirements are not decoration; they drive component choices and trade-offs.',
    ],
  },
  {
    id: 'section-1-1-8',
    order: 8,
    title: 'Functional vs Non-Functional Requirements',
    kind: 'concepts',
    paragraphs: [
      'Both categories are necessary. Functional requirements define the features a user can point to. Non-functional requirements define the qualities that make those features usable at the required scale and risk level.',
      'A system can satisfy every functional requirement and still fail if it is too slow, unavailable, insecure or impossible to change. Conversely, a fast and reliable system that cannot place orders is not useful.',
      'The comparison below uses the store examples. Notice that a statement becomes measurable when it includes a condition such as a response time under a specified workload or a defined service level.',
    ],
    keyPoints: [
      'Functional answers what; non-functional answers how well.',
      'Requirements should be measurable wherever possible.',
      'Trade-offs often happen because these two categories pull in different directions.',
    ],
  },
  {
    id: 'section-1-1-9',
    order: 9,
    title: 'Why Trade-offs Matter',
    kind: 'tradeoffs',
    paragraphs: [
      'An architectural decision usually improves one quality by giving up another. A trade-off is not a mistake; it is an explicit choice made with requirements in mind.',
      'There is rarely one universally best architecture. The right design depends on workload, constraints, team skill, budget and priorities. A design that is excellent for a small store may be unnecessary or even harmful for a different product.',
      'At this stage, name the gain and the cost in plain language. Detailed topics such as CAP theorem come later; the habit here is to ask what improves and what is accepted in return.',
    ],
    tradeoffs: [
      {
        id: 'tradeoff-1-1-cache',
        choice: 'Cache popular product pages',
        benefit: 'Faster reads and less database load.',
        cost: 'Cached data can be stale until it is refreshed or invalidated.',
      },
      {
        id: 'tradeoff-1-1-latency',
        choice: 'Tune for lower read latency',
        benefit: 'Responses return sooner for users.',
        cost: 'May require more infrastructure or weaker consistency for some reads.',
      },
      {
        id: 'tradeoff-1-1-simplicity',
        choice: 'Keep one application server',
        benefit: 'Simpler deployment, debugging and ownership.',
        cost: 'Less capacity and a larger failure impact as traffic grows.',
      },
      {
        id: 'tradeoff-1-1-redundancy',
        choice: 'Add redundant application servers',
        benefit: 'Higher availability when one instance fails.',
        cost: 'More coordination, configuration and operational work.',
      },
    ],
    keyPoints: [
      'No architecture is best in every context.',
      'State the cost beside the benefit.',
      'Revisit trade-offs when requirements change.',
    ],
  },
  {
    id: 'section-1-1-10',
    order: 10,
    title: 'How to Approach a System Design Problem',
    kind: 'process',
    paragraphs: [
      'Beginners often jump to technologies. That reverses the problem: a technology is a possible answer, but you need the question first. The workflow below turns a vague request into a defensible design.',
      'For a small store, this might mean confirming that browsing, registration, basket and checkout are in scope; agreeing that launch traffic is modest; choosing one application server and one database; and noting that a cache is a future option if reads become slow. The output can still be simple. What matters is that each choice has a reason.',
      'The same workflow is used in real engineering planning and in system design interviews. Interviewers and reviewers are not looking for a famous architecture. They want to see requirement questions, clear responsibilities, data flow and explicit trade-offs under constraints.',
    ],
    steps: [
      {
        id: 'step-1-1-10-1',
        title: 'Understand the problem',
        description: 'Restate the goal and identify who uses the system and what outcome they need.',
      },
      {
        id: 'step-1-1-10-2',
        title: 'Gather functional requirements',
        description: 'List the capabilities and observable behaviours that are in scope.',
      },
      {
        id: 'step-1-1-10-3',
        title: 'Gather non-functional requirements',
        description: 'Ask about performance, scalability, availability, reliability, security and maintainability.',
      },
      {
        id: 'step-1-1-10-4',
        title: 'Identify constraints',
        description: 'Record budget, timeline, team skills, compliance needs and existing systems.',
      },
      {
        id: 'step-1-1-10-5',
        title: 'Estimate workload when necessary',
        description: 'Use rough numbers for users, requests and data when scale could change the design.',
      },
      {
        id: 'step-1-1-10-6',
        title: 'Identify the main components',
        description: 'Name clients, servers, stores and optional helpers, then state one responsibility for each.',
      },
      {
        id: 'step-1-1-10-7',
        title: 'Define communication and data flow',
        description: 'Describe the APIs, request paths and where data is written or read.',
      },
      {
        id: 'step-1-1-10-8',
        title: 'Consider bottlenecks and failure scenarios',
        description: 'Ask what happens if a server is overloaded, a cache is empty or a dependency is unavailable.',
      },
      {
        id: 'step-1-1-10-9',
        title: 'Evaluate trade-offs',
        description: 'For each important choice, write the gain and the cost in plain language.',
      },
      {
        id: 'step-1-1-10-10',
        title: 'Review and improve the design',
        description: 'Check the design against the requirements and revise it; do not add components without a reason.',
      },
    ],
    keyPoints: [
      'Requirements and constraints come before technology selection.',
      'A first design can be small if the reasoning is explicit.',
      'Iterate instead of trying to produce a perfect diagram on the first pass.',
    ],
  },
  {
    id: 'section-1-1-11',
    order: 11,
    title: 'Common Mistakes',
    kind: 'mistakes',
    paragraphs: [
      'These mistakes are common because they produce visible activity: selecting a framework, drawing many boxes or producing a neat diagram. Good system design is less about looking sophisticated and more about making explicit, testable decisions.',
    ],
    commonMistakes: [
      'Choosing technologies before understanding requirements. It feels productive to name databases and frameworks early, but those choices cannot be judged without a target. Write requirements first and let them eliminate options.',
      'Assuming microservices are always better than monoliths. Microservices sound modern, yet they add network calls, deployment complexity and failure modes. Start with the simplest structure that meets the requirements and split only when a real boundary or scaling need appears.',
      'Ignoring non-functional requirements. Feature lists are easy to see, so speed, availability and security often get skipped. Ask how well the system must behave and attach measurable targets where possible.',
      'Designing for imaginary future scale. Adding queues, clusters and caches for traffic that may never arrive increases cost and complexity. Design for known needs and watch for signals that indicate real growth.',
      'Adding unnecessary components. A diagram with many boxes can look impressive, but every box needs an owner and an operational cost. Include a component only when you can explain the problem it solves.',
      'Confusing availability with reliability. A service can answer every request with the wrong order total. Ask both whether users can reach the system and whether its results are correct.',
      'Focusing only on diagrams without explaining decisions. Boxes and arrows do not show why a choice fits the requirements. Accompany each diagram with responsibilities, data flow, failure behaviour and trade-offs.',
    ],
    keyPoints: [
      'Ask why this component exists before adding it.',
      'Prefer a simple design that can be justified over a complex design that looks impressive.',
    ],
  },
  {
    id: 'section-1-1-12',
    order: 12,
    title: 'Key Takeaways',
    kind: 'concepts',
    paragraphs: [
      'System design turns requirements and constraints into a structure of components, communication and data flow. It begins with questions, not technology names.',
      'As systems grow, small choices about storage, caching, traffic distribution and failure handling become important. Each choice has a benefit and a cost, so trade-offs must be stated openly.',
      'Use the workflow in this lesson as a checklist: understand the problem, write both requirement types, name responsibilities, trace data, examine failure and revise.',
    ],
    keyPoints: [
      'System design defines how the complete application is structured.',
      'The main building blocks are clients, servers, APIs, databases, caches, load balancers and message queues.',
      'Functional requirements say what the system does; non-functional requirements say how well it does it.',
      'Scalability, availability, reliability and performance are distinct qualities that must be explicit.',
      'Every architectural choice has a gain and a cost.',
      'Requirement-first thinking keeps the design small, explainable and adaptable.',
    ],
  },
]

export const codeExamples: CodeExample[] = [
  {
    id: 'code-1-1-http-request-response',
    title: 'One HTTP request and response',
    language: 'text',
    code: [
      'GET /products/42 HTTP/1.1',
      'Host: store.example.com',
      'Accept: application/json',
      '',
      'HTTP/1.1 200 OK',
      'Content-Type: application/json',
      'Cache-Control: max-age=60',
      '',
      '{',
      '  "id": 42,',
      '  "name": "Desk lamp",',
      '  "price": 39.00',
      '}',
    ].join('\n'),
    explanation:
      'The first lines are the client request: the method and path name the resource, Host routes it to the store, and Accept asks for JSON. The remaining lines are the server response: 200 OK reports success, Cache-Control says the result may be reused briefly, and the body carries the product data the browser will display.',
  },
  {
    id: 'code-1-1-api-endpoint',
    title: 'A product endpoint with a conditional cache path',
    language: 'text',
    code: [
      '// Illustrative C#-style pseudocode, not tied to one framework.',
      'app.MapGet("/products/{id:int}", async (int id, ProductStore store, Cache cache) =>',
      '{',
      '    var cached = cache.TryGet(id);',
      '    if (cached is not null) return Results.Ok(cached);',
      '',
      '    var product = await store.GetByIdAsync(id);',
      '    if (product is null) return Results.NotFound();',
      '',
      '    cache.Set(id, product, TimeSpan.FromMinutes(1));',
      '    return Results.Ok(product);',
      '});',
    ].join('\n'),
    explanation:
      'This endpoint is the server side of the API contract. It checks the cache first and returns immediately on a hit. On a miss it reads the durable store, stores a temporary copy and returns the product; the one-minute lifetime is a trade-off between faster reads and the chance of serving slightly stale data.',
  },
]

export const comparisons: Comparison[] = [
  {
    id: 'comparison-1-1-functional-vs-nonfunctional',
    title: 'Functional vs non-functional requirements',
    summary:
      'Functional requirements describe capabilities; non-functional requirements describe measurable qualities. Both must be explicit before a design can be judged.',
    columns: [{ id: 'category', label: 'Category' }],
    rows: [
      {
        id: 'row-create-account',
        criterion: 'User can create an account',
        values: { category: 'Functional' },
      },
      {
        id: 'row-api-latency',
        criterion: 'API responds within 200 ms under a specified workload',
        values: { category: 'Non-Functional' },
      },
      {
        id: 'row-place-order',
        criterion: 'User can place an order',
        values: { category: 'Functional' },
      },
      {
        id: 'row-concurrent-users',
        criterion: 'System supports 10,000 concurrent users',
        values: { category: 'Non-Functional' },
      },
      {
        id: 'row-search-products',
        criterion: 'User can search for products',
        values: { category: 'Functional' },
      },
      {
        id: 'row-service-level',
        criterion: 'System remains available at a defined service level',
        values: { category: 'Non-Functional' },
      },
    ],
  },
]

export const practicalChallenges: PracticalChallenge[] = [
  {
    id: 'challenge-1-1',
    title: 'Challenge: Design a Simple Online Store',
    scenario:
      'You are building an online store. The first version supports browsing products, user registration, adding products to a basket and placing orders. No architecture has been chosen yet.',
    requirements: [
      'Identify the functional requirements for the initial version.',
      'Write at least three non-functional requirements with measurable targets where reasonable.',
      'Name the main system components and state one responsibility for each.',
      'Describe how components communicate when a user browses products and when a user places an order.',
      'Identify one likely bottleneck as usage grows and explain how you would detect it.',
    ],
    constraints: [
      'No implementation code.',
      'Do not add a cache, load balancer or queue unless you can justify it.',
      'Keep the first sketch small enough to explain in a few minutes.',
    ],
    deliverables: [
      'A short design brief with requirements, components, two request flows and one bottleneck note.',
      'A one-paragraph explanation of one trade-off in your design.',
    ],
    hints: [
      'Start with actors and actions before drawing boxes.',
      'A cache reduces repeated reads but introduces the possibility of stale data.',
      'A bottleneck is a component that limits overall throughput; ask which component receives the most requests or holds the most data.',
      'There is no single correct answer. The quality of your reasoning matters more than the number of boxes.',
    ],
  },
]

export const lessonSummaries: LessonSummary[] = [
  {
    id: 'summary-1-1',
    overview:
      'System design is the practice of shaping components, communication and data flow to satisfy requirements and constraints. Requirement-first thinking keeps a design small, explainable and adaptable.',
    keyTakeaways: [
      'System design decides how the complete application is structured; coding implements features inside that structure.',
      'The main building blocks are clients, servers, APIs, databases, caches, load balancers and message queues; several are optional.',
      'Functional requirements say what the system does; non-functional requirements say how well it does it.',
      'Scalability, availability, reliability and performance are distinct qualities that must be stated explicitly.',
      'Every architectural choice has a gain and a cost; state the trade-off instead of hiding it.',
      'Start with requirements and constraints, then components and data flow; choose technology last.',
    ],
    nextSteps: [
      'Apply the ten-step workflow to the practical challenge before moving on.',
      'Open the linked simulation to watch the client–server request path described in this lesson.',
    ],
  },
]
