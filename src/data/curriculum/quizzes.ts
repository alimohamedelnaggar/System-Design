import type { Quiz } from '../../types/curriculum.ts'

/** Quiz data is stored separately so content files stay focused on prose. */
export const quizzes: Quiz[] = [
  {
    id: 'quiz-1-1',
    title: 'What is System Design? — knowledge check',
    description: 'Five questions to check the core distinctions from this lesson.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-1-q1',
        prompt:
          'A team is deciding which parts of an online store should own checkout, where order data will be stored, and how the browser will communicate with those parts. What is this work called?',
        options: [
          {
            id: 'quiz-1-1-q1-a',
            label: 'Debugging an existing defect',
            isCorrect: false,
            explanation: 'Debugging finds and fixes a wrong behaviour; it does not define the structure of the system.',
          },
          {
            id: 'quiz-1-1-q1-b',
            label: 'System design',
            isCorrect: true,
            explanation:
              'System design defines components, responsibilities, communication and data flow so the system meets its requirements.',
          },
          {
            id: 'quiz-1-1-q1-c',
            label: 'Syntax formatting',
            isCorrect: false,
            explanation: 'Formatting changes how code looks, not how components are organised or communicate.',
          },
          {
            id: 'quiz-1-1-q1-d',
            label: 'Unit testing',
            isCorrect: false,
            explanation: 'Unit testing checks small pieces of code; it assumes the structure already exists.',
          },
        ],
        explanation: 'The decisions described are about the shape of the whole application, not one implementation detail.',
      },
      {
        id: 'quiz-1-1-q2',
        prompt: 'Which statement is a non-functional requirement for the store?',
        options: [
          {
            id: 'quiz-1-1-q2-a',
            label: 'Users can add products to a basket.',
            isCorrect: false,
            explanation: 'This is a capability a user can perform, so it is a functional requirement.',
          },
          {
            id: 'quiz-1-1-q2-b',
            label: 'The product API responds within 200 ms at 1,000 requests per second.',
            isCorrect: true,
            explanation:
              'This is a measurable quality attribute with a workload condition, so it is a non-functional requirement.',
          },
          {
            id: 'quiz-1-1-q2-c',
            label: 'Users can track order status.',
            isCorrect: false,
            explanation: 'Tracking an order is observable behaviour, which makes it functional.',
          },
          {
            id: 'quiz-1-1-q2-d',
            label: 'Admins can remove a product listing.',
            isCorrect: false,
            explanation: 'An admin action is still a system capability, not a quality attribute.',
          },
        ],
        explanation: 'Functional requirements say what the system does; non-functional requirements say how well it does it.',
      },
      {
        id: 'quiz-1-1-q3',
        prompt: 'A product page reads the same catalogue data many times. What is the main reason to add a cache?',
        options: [
          {
            id: 'quiz-1-1-q3-a',
            label: 'To permanently replace the database as the source of truth.',
            isCorrect: false,
            explanation: 'A cache holds copies; the database remains the durable source of truth.',
          },
          {
            id: 'quiz-1-1-q3-b',
            label: 'To avoid repeating an expensive read by keeping a fast, temporary copy.',
            isCorrect: true,
            explanation: 'A cache stores a result so repeated reads can be served without repeating the expensive work.',
          },
          {
            id: 'quiz-1-1-q3-c',
            label: 'To guarantee that every response uses only the newest data.',
            isCorrect: false,
            explanation: 'Caches can serve stale data if the underlying data changes before the copy is refreshed.',
          },
          {
            id: 'quiz-1-1-q3-d',
            label: 'To remove the need for an API contract between components.',
            isCorrect: false,
            explanation: 'A cache sits behind the API; it does not define or replace the communication contract.',
          },
        ],
        explanation: 'The benefit is faster repeated reads; the cost is the need to manage freshness.',
      },
      {
        id: 'quiz-1-1-q4',
        prompt:
          'A service answers every request, but it sometimes returns the wrong order total. Which statement best describes the situation?',
        options: [
          {
            id: 'quiz-1-1-q4-a',
            label: 'It is reliable but not available.',
            isCorrect: false,
            explanation: 'It is reachable, so it is available; incorrect results make it unreliable.',
          },
          {
            id: 'quiz-1-1-q4-b',
            label: 'It is available but not reliable.',
            isCorrect: true,
            explanation: 'Availability concerns reachability; reliability concerns correct behaviour over time.',
          },
          {
            id: 'quiz-1-1-q4-c',
            label: 'It is neither available nor reliable.',
            isCorrect: false,
            explanation: 'It is available because requests are answered; the failure is in correctness.',
          },
          {
            id: 'quiz-1-1-q4-d',
            label: 'Availability and reliability are identical, so the distinction does not apply.',
            isCorrect: false,
            explanation: 'They are distinct qualities: a system can be reachable while producing wrong results.',
          },
        ],
        explanation: 'Ask two separate questions: can users reach the system, and does it behave correctly?',
      },
      {
        id: 'quiz-1-1-q5',
        prompt:
          'A small store grows from 10 to 100,000 users. A proposal adds two application servers behind a load balancer and a cache for product reads. What is the most balanced evaluation?',
        options: [
          {
            id: 'quiz-1-1-q5-a',
            label: 'It is always the correct architecture for any growing application.',
            isCorrect: false,
            explanation: 'Architecture depends on requirements and constraints; there is no universal answer.',
          },
          {
            id: 'quiz-1-1-q5-b',
            label: 'It removes the need to measure performance or define requirements.',
            isCorrect: false,
            explanation: 'Adding components increases the need to verify that they solve a measured problem.',
          },
          {
            id: 'quiz-1-1-q5-c',
            label:
              'It can improve capacity and read latency, but it adds coordination, cost and possible stale data.',
            isCorrect: true,
            explanation: 'This names both the likely benefit and the costs, which is how trade-offs should be evaluated.',
          },
          {
            id: 'quiz-1-1-q5-d',
            label: 'It only changes deployment, not correctness or failure behaviour.',
            isCorrect: false,
            explanation: 'More instances and a cache change failure paths, freshness and operational complexity.',
          },
        ],
        explanation: 'Good design reasoning states what improves and what is accepted in return.',
      },
    ],
  },
  {
    id: 'quiz-1-2',
    title: 'Client-Server Architecture — knowledge check',
    description: 'Five questions about clients, servers, request flow, state and architectural tiers.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-2-q1',
        prompt:
          'A shopper’s browser collects a product id, sends GET /api/products/42 and displays the returned product. Which statement best describes the browser in this interaction?',
        options: [
          {
            id: 'quiz-1-2-q1-a',
            label: 'It is the database because it stores the product row.',
            isCorrect: false,
            explanation: 'The browser does not store the durable catalogue; the database does.',
          },
          {
            id: 'quiz-1-2-q1-b',
            label: 'It is the client because it starts the request and handles the response.',
            isCorrect: true,
            explanation: 'A client initiates an interaction and processes or displays what the server returns.',
          },
          {
            id: 'quiz-1-2-q1-c',
            label: 'It is the application tier because it applies shared pricing rules.',
            isCorrect: false,
            explanation: 'Shared pricing rules belong on the server; the browser handles presentation and user input.',
          },
          {
            id: 'quiz-1-2-q1-d',
            label: 'It is the network because it carries the request bytes.',
            isCorrect: false,
            explanation: 'The network carries bytes between components; it is not the program that starts the request.',
          },
        ],
        explanation: 'The browser acts as a client even though the product data comes from another program.',
      },
      {
        id: 'quiz-1-2-q2',
        prompt:
          'An API receives GET /api/products/42, checks that the product is visible, reads the stored row and returns 200 with JSON. Which responsibility belongs to the server here?',
        options: [
          {
            id: 'quiz-1-2-q2-a',
            label: 'Deciding the browser’s final page layout.',
            isCorrect: false,
            explanation: 'Rendering the final layout is a presentation responsibility of the client.',
          },
          {
            id: 'quiz-1-2-q2-b',
            label: 'Choosing the screen size of the shopper’s device.',
            isCorrect: false,
            explanation: 'Device characteristics come from the client; the server does not choose them.',
          },
          {
            id: 'quiz-1-2-q2-c',
            label: 'Applying the visibility rule and returning the product result.',
            isCorrect: true,
            explanation: 'Servers apply shared rules, access data when needed and build the response.',
          },
          {
            id: 'quiz-1-2-q2-d',
            label: 'Removing the need for a data store.',
            isCorrect: false,
            explanation: 'A server often reads or writes a durable store; it does not eliminate the need for one.',
          },
        ],
        explanation: 'Server responsibilities include validation, business rules, data access and response creation.',
      },
      {
        id: 'quiz-1-2-q3',
        prompt: 'Which sequence correctly orders the request-response cycle?',
        options: [
          {
            id: 'quiz-1-2-q3-a',
            label: 'Server response, client request, database query, user action.',
            isCorrect: false,
            explanation: 'The cycle starts with a user action and a client request, not with a response.',
          },
          {
            id: 'quiz-1-2-q3-b',
            label:
              'User action, client prepares a request, server processes it, response returns, client displays the result.',
            isCorrect: true,
            explanation: 'This is the complete request-response order described in the lesson.',
          },
          {
            id: 'quiz-1-2-q3-c',
            label: 'Client displays the result, user acts, server prepares a request, network creates data.',
            isCorrect: false,
            explanation: 'Display happens after the response; the network transports data rather than creating it.',
          },
          {
            id: 'quiz-1-2-q3-d',
            label: 'Database query, client request, user action, response.',
            isCorrect: false,
            explanation: 'The user acts first, and the server queries the database during processing.',
          },
        ],
        explanation: 'Trace the message from the caller to the processor and back to the caller.',
      },
      {
        id: 'quiz-1-2-q4',
        prompt:
          'A product API accepts a token and product id with every request. Any server instance can answer without remembering an earlier click. Which statement is accurate?',
        options: [
          {
            id: 'quiz-1-2-q4-a',
            label:
              'This is stateless communication, but the application may still store products in a database.',
            isCorrect: true,
            explanation:
              'Stateless means the request does not need remembered conversation context; durable data storage is separate.',
          },
          {
            id: 'quiz-1-2-q4-b',
            label: 'This is stateful because the database stores product data.',
            isCorrect: false,
            explanation: 'Stored data alone does not make the communication stateful; session context is the issue.',
          },
          {
            id: 'quiz-1-2-q4-c',
            label: 'This is stateless, so the server cannot use caches or databases.',
            isCorrect: false,
            explanation: 'Stateless systems can use databases and caches; they simply do not depend on remembered request context.',
          },
          {
            id: 'quiz-1-2-q4-d',
            label: 'This is stateful because the browser can keep a page history.',
            isCorrect: false,
            explanation: 'Browser history is client-side convenience; it does not make the server remember a session.',
          },
        ],
        explanation: 'Ask what context the server must remember between requests, not whether data is stored anywhere.',
      },
      {
        id: 'quiz-1-2-q5',
        prompt:
          'A catalog must serve web and mobile clients with identical prices and controlled database access. Which architectural reasoning best fits?',
        options: [
          {
            id: 'quiz-1-2-q5-a',
            label: 'Two tiers are always better because they contain fewer boxes.',
            isCorrect: false,
            explanation: 'Fewer components can help, but the choice depends on rules, callers and access control.',
          },
          {
            id: 'quiz-1-2-q5-b',
            label: 'Three tiers are always better because they are more modern.',
            isCorrect: false,
            explanation: 'Architecture is not a trend ranking; another boundary must solve a real need.',
          },
          {
            id: 'quiz-1-2-q5-c',
            label:
              'A 3-tier design can centralise pricing rules and mediate database access, at the cost of another boundary.',
            isCorrect: true,
            explanation:
              'This names the benefits for multiple clients and the cost of the extra application tier.',
          },
          {
            id: 'quiz-1-2-q5-d',
            label: 'A 2-tier design is required because logical tiers must be physical servers.',
            isCorrect: false,
            explanation: 'Tiers are logical responsibilities; physical deployment is a separate decision.',
          },
        ],
        explanation: 'Choose a structure by matching shared rules, data access and operational cost to the requirements.',
      },
    ],
  },
  {
    id: 'quiz-1-3',
    title: 'Web Fundamentals — knowledge check',
    description: 'Five questions on DNS, HTTP, HTTPS, transport and the complete browser journey.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-3-q1',
        prompt:
          'A shopper opens https://shop.example.com/products. The browser and operating-system DNS caches are empty. Which statement best describes how the destination IP address is found?',
        options: [
          {
            id: 'quiz-1-3-q1-a',
            label: 'A root server keeps a complete list of every website and returns the final answer directly.',
            isCorrect: false,
            explanation:
              'Root servers refer clients to the appropriate TLD servers; they do not hold a complete directory of all names.',
          },
          {
            id: 'quiz-1-3-q1-b',
            label:
              'A recursive resolver asks a root server, then the .com TLD server, then the authoritative server for example.com, and caches the returned record for its TTL.',
            isCorrect: true,
            explanation:
              'This is the full conceptual lookup path when caches are empty. The TTL bounds how long the answer may be reused.',
          },
          {
            id: 'quiz-1-3-q1-c',
            label: 'The browser sends the domain name to a search engine, which replies with the server address.',
            isCorrect: false,
            explanation: 'Search engines are not part of name resolution; DNS performs this lookup.',
          },
          {
            id: 'quiz-1-3-q1-d',
            label: 'The authoritative server downloads the product page and sends it to the browser along with the address.',
            isCorrect: false,
            explanation: 'Authoritative DNS servers answer name queries; a separate web server serves the page.',
          },
        ],
        explanation: 'DNS is a distributed lookup hierarchy, and caching means the full path is not always needed.',
      },
      {
        id: 'quiz-1-3-q2',
        prompt:
          'The request for /products is about to be sent. Which description of the HTTP request and response is accurate?',
        options: [
          {
            id: 'quiz-1-3-q2-a',
            label: 'Every HTTP request must contain a body; otherwise the server cannot identify the resource.',
            isCorrect: false,
            explanation: 'A GET request normally has no body; the method and request target identify the resource.',
          },
          {
            id: 'quiz-1-3-q2-b',
            label:
              'The request has a request line with method, target and version, then headers and an optional body; the response has a status line, headers and a body.',
            isCorrect: true,
            explanation: 'These are the structural parts of HTTP messages; the blank line separates headers from the body.',
          },
          {
            id: 'quiz-1-3-q2-c',
            label: 'A 200 status code guarantees the shopper will be happy with the business outcome.',
            isCorrect: false,
            explanation:
              'A status reports how the request was handled; the body can still report an out-of-stock item or another outcome.',
          },
          {
            id: 'quiz-1-3-q2-d',
            label: 'The browser queries the product database directly and the server only renders HTML.',
            isCorrect: false,
            explanation: 'The server owns data access; the browser sends an HTTP request rather than a database query.',
          },
        ],
        explanation: 'HTTP is a request-response protocol whose messages have a defined line, headers and optional body.',
      },
      {
        id: 'quiz-1-3-q3',
        prompt: 'Which statement best captures what HTTPS adds to a web request?',
        options: [
          {
            id: 'quiz-1-3-q3-a',
            label: 'It replaces HTTP with a completely different application protocol.',
            isCorrect: false,
            explanation: 'The messages are still HTTP; they are carried inside a TLS-protected connection.',
          },
          {
            id: 'quiz-1-3-q3-b',
            label:
              'TLS validates the server certificate, establishes keys for encrypted and integrity-checked messages, and reduces transport risks without guaranteeing application security.',
            isCorrect: true,
            explanation:
              'This names the confidentiality, integrity and authentication benefits while keeping the security limit explicit.',
          },
          {
            id: 'quiz-1-3-q3-c',
            label: 'It encrypts DNS lookups and hides the destination address and all traffic patterns.',
            isCorrect: false,
            explanation: 'HTTPS protects the HTTP connection; it does not make every property of the network invisible.',
          },
          {
            id: 'quiz-1-3-q3-d',
            label: 'The TLS handshake always follows the same fixed sequence in every version and configuration.',
            isCorrect: false,
            explanation: 'Handshake details and round trips vary by TLS version and configuration.',
          },
        ],
        explanation: 'HTTPS is transport protection around HTTP, not a different protocol and not complete application security.',
      },
      {
        id: 'quiz-1-3-q4',
        prompt: 'Before an HTTP/1.1 request can be sent over a new TCP connection, what happens?',
        options: [
          {
            id: 'quiz-1-3-q4-a',
            label: 'The browser sends SYN, the server replies SYN-ACK, the browser sends ACK, and both sides hold state for a reliable byte stream.',
            isCorrect: true,
            explanation: 'This three-way handshake establishes the connection before TLS negotiation and HTTP messages.',
          },
          {
            id: 'quiz-1-3-q4-b',
            label: 'A single SYN message reserves the connection, so no acknowledgement is needed.',
            isCorrect: false,
            explanation: 'Both sides must agree; the SYN-ACK and ACK messages complete the agreement.',
          },
          {
            id: 'quiz-1-3-q4-c',
            label: 'TCP defines the HTTP method, headers and status codes used in the request.',
            isCorrect: false,
            explanation: 'TCP provides a reliable byte stream; HTTP defines the application messages carried on it.',
          },
          {
            id: 'quiz-1-3-q4-d',
            label: 'HTTP/3 must also perform this TCP handshake because it relies on TCP.',
            isCorrect: false,
            explanation: 'HTTP/3 uses QUIC over UDP and establishes its connection differently.',
          },
        ],
        explanation: 'Connection setup is a transport concern, separate from DNS and from HTTP message format.',
      },
      {
        id: 'quiz-1-3-q5',
        prompt:
          'Which ordering best represents the simplified journey from entering https://shop.example.com/products to seeing the page?',
        options: [
          {
            id: 'quiz-1-3-q5-a',
            label:
              'Parse URL, check caches, resolve DNS, establish transport, negotiate TLS, send HTTP request, server processes, return HTTP response, render.',
            isCorrect: true,
            explanation:
              'This follows the logical dependencies: each stage needs the result of the one before it.',
          },
          {
            id: 'quiz-1-3-q5-b',
            label:
              'Negotiate TLS, resolve DNS, establish transport, send the request, then check caches after the response.',
            isCorrect: false,
            explanation: 'TLS needs a connection to an address, so DNS and transport must come first.',
          },
          {
            id: 'quiz-1-3-q5-c',
            label: 'Resolve DNS, download the page, then parse the URL to decide which server to contact.',
            isCorrect: false,
            explanation: 'The browser must parse the URL before it knows which name to resolve.',
          },
          {
            id: 'quiz-1-3-q5-d',
            label: 'Send the HTTP request first, then resolve DNS if the server cannot be reached.',
            isCorrect: false,
            explanation: 'An address and a connection are required before an HTTP request can be delivered.',
          },
        ],
        explanation:
          'Real browsers may reuse connections or fetch assets in parallel, but this is the conceptual sequence.',
      },
    ],
  },
  {
    id: 'quiz-1-4',
    title: 'APIs — knowledge check',
    description: 'Five questions on API contracts, REST resources, methods, status codes and error design.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-4-q1',
        prompt:
          'A store frontend must stop depending on the product table layout. Which statement best describes the role of an API contract?',
        options: [
          {
            id: 'quiz-1-4-q1-a',
            label: 'It publishes the database schema so every client can query the tables it needs directly.',
            isCorrect: false,
            explanation: 'Publishing the schema couples every client to storage details; the contract should hide them.',
          },
          {
            id: 'quiz-1-4-q1-b',
            label:
              'It defines the documented operations, inputs, outputs and error behaviour that provider and consumer agree on, hiding internal implementation.',
            isCorrect: true,
            explanation:
              'This is the boundary: both sides depend on the promises, while the implementation behind them can change.',
          },
          {
            id: 'quiz-1-4-q1-c',
            label: 'It is the screens and forms the shopper uses to browse and buy products.',
            isCorrect: false,
            explanation: 'Those are the user interface; the API is the programmatic boundary behind it.',
          },
          {
            id: 'quiz-1-4-q1-d',
            label: 'It is the JSON format used to encode responses.',
            isCorrect: false,
            explanation: 'JSON is one possible representation format, not the operations, semantics or errors of the API.',
          },
        ],
        explanation:
          'The contract is the intentional coupling between provider and consumer; everything behind it stays replaceable.',
      },
      {
        id: 'quiz-1-4-q2',
        prompt:
          'A store API currently uses /getProducts, /createProduct and /deleteProduct/42. Which redesign best follows resource-oriented REST conventions?',
        options: [
          {
            id: 'quiz-1-4-q2-a',
            label: 'Keep the paths but always call them with GET so they are safe and idempotent.',
            isCorrect: false,
            explanation: 'Calling an action path with GET hides state-changing intent from caches and clients.',
          },
          {
            id: 'quiz-1-4-q2-b',
            label:
              'Use /api/products for GET and POST, and /api/products/42 for GET, PUT, PATCH and DELETE.',
            isCorrect: true,
            explanation:
              'Paths name the collection and the individual resource, while methods express the operation predictably.',
          },
          {
            id: 'quiz-1-4-q2-c',
            label: 'Use /api/products/list, /api/products/create and /api/products/delete/42 to make the paths uniform.',
            isCorrect: false,
            explanation: 'Putting verbs in paths still encodes actions in URLs and forfeits the uniform interface.',
          },
          {
            id: 'quiz-1-4-q2-d',
            label: 'Use one endpoint /api/products/operation with a JSON field naming the action to perform.',
            isCorrect: false,
            explanation: 'This collapses distinct resources into one action dispatcher and makes the API hard to predict.',
          },
        ],
        explanation:
          'Resource-oriented design is a strong default, with documented exceptions for operations that are genuinely actions.',
      },
      {
        id: 'quiz-1-4-q3',
        prompt:
          'A client updates product 42 by sending a full replacement body, then retries after a timeout. Which reasoning is correct?',
        options: [
          {
            id: 'quiz-1-4-q3-a',
            label:
              'The operation is PUT: it is not safe, but it is idempotent, so repeating the same full representation has the same intended effect.',
            isCorrect: true,
            explanation:
              'PUT changes state, so it is not safe; repeating the same complete state leaves the same final result.',
          },
          {
            id: 'quiz-1-4-q3-b',
            label: 'The operation is GET, because only GET can be safely retried.',
            isCorrect: false,
            explanation: 'GET does not replace a resource; PUT, DELETE and some PATCH operations can also be safe to retry.',
          },
          {
            id: 'quiz-1-4-q3-c',
            label: 'The operation is POST, and POST is idempotent whenever the body is a full representation.',
            isCorrect: false,
            explanation: 'POST is generally not idempotent by default regardless of the body shape.',
          },
          {
            id: 'quiz-1-4-q3-d',
            label: 'The operation is PATCH, and every PATCH request is idempotent.',
            isCorrect: false,
            explanation: 'PATCH idempotency depends on the operation; an incremental change is not idempotent.',
          },
        ],
        explanation:
          'Idempotency concerns the intended final effect, not whether a repeated call returns an identical response.',
      },
      {
        id: 'quiz-1-4-q4',
        prompt:
          'A request to view an order returns 401 on one occasion and 403 on another. What distinguishes these outcomes?',
        options: [
          {
            id: 'quiz-1-4-q4-a',
            label: '401 means the order was deleted; 403 means the order still exists but is out of stock.',
            isCorrect: false,
            explanation: 'Neither code describes resource state; 404 and 409 would be relevant there.',
          },
          {
            id: 'quiz-1-4-q4-b',
            label:
              '401 means authentication is missing or failed, while 403 means the caller is identified but access is forbidden.',
            isCorrect: true,
            explanation:
              '401 asks for valid identity; 403 is an authorization refusal after identity is known.',
          },
          {
            id: 'quiz-1-4-q4-c',
            label: '401 is a server-side failure; 403 is a client-side validation failure.',
            isCorrect: false,
            explanation: 'Both are 4xx client-error codes; server failures use 5xx and validation failures use 400 or 422.',
          },
          {
            id: 'quiz-1-4-q4-d',
            label: 'They are interchangeable, so an API may use either for the same situation.',
            isCorrect: false,
            explanation: 'Clients take different actions: they can reauthenticate after 401 but should not blindly retry 403.',
          },
        ],
        explanation: 'Status codes are a coarse but meaningful signal; their categories must be used consistently.',
      },
      {
        id: 'quiz-1-4-q5',
        prompt:
          'A PATCH /api/products/42 request sends valid JSON with a stock value that exceeds the allowed limit. What should a well-designed API return?',
        options: [
          {
            id: 'quiz-1-4-q5-a',
            label:
              'A 200 response with a message in the body telling the client the value was rejected.',
            isCorrect: false,
            explanation: 'Returning 200 for failure hides the outcome from clients and caches.',
          },
          {
            id: 'quiz-1-4-q5-b',
            label:
              'A 400 or 422 response with a consistent JSON error body naming the invalid field and the validation rule.',
            isCorrect: true,
            explanation:
              'The syntax is valid but the content fails validation, and the error body supplies details the status cannot carry.',
          },
          {
            id: 'quiz-1-4-q5-c',
            label: 'A 401 response, because the client supplied data the server did not accept.',
            isCorrect: false,
            explanation: 'Authentication is unrelated to a validation failure on a field value.',
          },
          {
            id: 'quiz-1-4-q5-d',
            label:
              'A 500 response with the database error text so the client can see exactly what went wrong.',
            isCorrect: false,
            explanation: 'This is a client error, and internal details should be logged rather than exposed in responses.',
          },
        ],
        explanation:
          'JSON only represents the payload; the contract must also define status codes and a reusable error shape.',
      },
    ],
  },
  {
    id: 'quiz-1-5',
    title: 'Performance Basics — knowledge check',
    description:
      'Five questions on latency, throughput, bandwidth, response-time boundaries, percentiles and bottlenecks.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-5-q1',
        prompt:
          'A store API completes 800 requests per second, but p95 client-observed response time has risen to two seconds. What does this combination best demonstrate?',
        options: [
          {
            id: 'quiz-1-5-q1-a',
            label: 'Throughput and latency are the same measurement expressed in different units.',
            isCorrect: false,
            explanation: 'They measure different things: completed work per time versus delay across an interval.',
          },
          {
            id: 'quiz-1-5-q1-b',
            label: 'The rise in response time proves that network bandwidth is saturated.',
            isCorrect: false,
            explanation:
              'Bandwidth is one possible constraint; queueing, a database or an external service could cause this pattern.',
          },
          {
            id: 'quiz-1-5-q1-c',
            label:
              'The system is still completing work, but throughput alone cannot describe the delay users experience; latency distribution and errors are also needed.',
            isCorrect: true,
            explanation:
              'High completed throughput can coexist with long queues or timeouts, so the metrics must be interpreted together.',
          },
          {
            id: 'quiz-1-5-q1-d',
            label: 'A p95 of two seconds means 95 percent of requests were slower than two seconds.',
            isCorrect: false,
            explanation: 'p95 means 95 percent completed at or below that value for the stated population and window.',
          },
        ],
        explanation:
          'Throughput counts completed work, while percentiles describe the delay distribution; neither substitutes for the other.',
      },
      {
        id: 'quiz-1-5-q2',
        prompt:
          'An API has 100 Mbps of available network bandwidth and serves 900 tiny requests per second. Which statement is accurate?',
        options: [
          {
            id: 'quiz-1-5-q2-a',
            label: 'The API achieved 100 Mbps of throughput because that is the link capacity.',
            isCorrect: false,
            explanation: 'Capacity is not achievement; actual transfer depends on payload size and application behaviour.',
          },
          {
            id: 'quiz-1-5-q2-b',
            label: 'Serving 900 requests per second must have saturated the 100 Mbps link.',
            isCorrect: false,
            explanation: 'Many tiny requests can add up to very little data, so RPS alone does not imply link saturation.',
          },
          {
            id: 'quiz-1-5-q2-c',
            label:
              'Requests per second counts completed work, while Mbps describes transfer capacity; high RPS with tiny payloads can coexist with low bandwidth use.',
            isCorrect: true,
            explanation: 'Work units and data capacity are different quantities with different units and constraints.',
          },
          {
            id: 'quiz-1-5-q2-d',
            label: 'Bandwidth and throughput are interchangeable terms in network performance.',
            isCorrect: false,
            explanation:
              'Bandwidth is a capacity ceiling; achieved throughput is what the system actually transfers or completes.',
          },
        ],
        explanation:
          'Always check the unit: bits per second describes channel capacity, while requests per second describes completed work.',
      },
      {
        id: 'quiz-1-5-q3',
        prompt:
          'A browser stops a timer when a fetch promise resolves, and a server logs the duration of its handler. Why may these numbers disagree?',
        options: [
          {
            id: 'quiz-1-5-q3-a',
            label:
              'The fetch timer typically ends when response headers arrive and may exclude body reading, while the server log excludes client-side network travel.',
            isCorrect: true,
            explanation: 'Different observers and end events produce different, equally valid measurements.',
          },
          {
            id: 'quiz-1-5-q3-b',
            label: 'Both timers measure exactly the same interval, so a disagreement is always a bug.',
            isCorrect: false,
            explanation: 'They have different boundaries; compare definitions before assuming a measurement error.',
          },
          {
            id: 'quiz-1-5-q3-c',
            label: 'The server-side duration normally includes browser rendering time.',
            isCorrect: false,
            explanation: 'Rendering happens on the client after the response, outside the server handler.',
          },
          {
            id: 'quiz-1-5-q3-d',
            label: 'fetch always rejects for HTTP 5xx responses, so no duration can be recorded.',
            isCorrect: false,
            explanation: 'fetch resolves for HTTP error statuses; response.ok must be checked separately.',
          },
        ],
        explanation: 'State the observer, start event and end event before comparing response-time measurements.',
      },
      {
        id: 'quiz-1-5-q4',
        prompt:
          'For 1,000 product requests over five minutes, p50 is 40 ms, p95 is 800 ms and p99 is 1,200 ms. What is a valid interpretation?',
        options: [
          {
            id: 'quiz-1-5-q4-a',
            label: 'The average latency must be 800 ms because p95 dominates the mean.',
            isCorrect: false,
            explanation: 'A mean depends on all values; percentiles cannot determine it without the full distribution.',
          },
          {
            id: 'quiz-1-5-q4-b',
            label: 'Ninety-nine percent of requests took longer than 1,200 ms.',
            isCorrect: false,
            explanation: 'p99 means 99 percent completed at or below 1,200 ms, not above it.',
          },
          {
            id: 'quiz-1-5-q4-c',
            label: 'These percentiles can be added with other services to obtain end-to-end tail latency.',
            isCorrect: false,
            explanation: 'Percentiles are not additive across services; measure the end-to-end boundary directly.',
          },
          {
            id: 'quiz-1-5-q4-d',
            label:
              'Ninety-five percent of requests completed at or below 800 ms, and the distribution has a slow tail for this window and population.',
            isCorrect: true,
            explanation:
              'Percentiles describe a defined population over a window and reveal tail behaviour the median hides.',
          },
        ],
        explanation:
          'A large gap between p50 and p95 or p99 signals a slow subgroup that an average can obscure.',
      },
      {
        id: 'quiz-1-5-q5',
        prompt:
          'During a campaign, database CPU is high, application threads wait for connections, throughput plateaus and timeouts rise. What is the most defensible next step?',
        options: [
          {
            id: 'quiz-1-5-q5-a',
            label: 'Add application servers immediately so each request has more CPU available.',
            isCorrect: false,
            explanation: 'Extra instances may add more connections to an already constrained database.',
          },
          {
            id: 'quiz-1-5-q5-b',
            label:
              'Investigate query patterns, connection limits and queueing; treat high CPU as a clue and verify the bottleneck before choosing an optimization.',
            isCorrect: true,
            explanation: 'Diagnose the constraint from evidence first, then choose an intervention and measure the result.',
          },
          {
            id: 'quiz-1-5-q5-c',
            label: 'Upgrade network bandwidth because timeouts are always network failures.',
            isCorrect: false,
            explanation: 'Timeouts can result from queueing, contention or dependency delays, not only network capacity.',
          },
          {
            id: 'quiz-1-5-q5-d',
            label: 'Report only average response time because percentiles are unreliable under load.',
            isCorrect: false,
            explanation: 'Percentiles are precisely what reveal the slow requests that averages hide.',
          },
        ],
        explanation:
          'Symptoms appear far from their cause; high utilization is evidence to investigate, not a universal diagnosis.',
      },
    ],
  },
  {
    id: 'quiz-1-6',
    title: 'Architecture Styles — knowledge check',
    description:
      'Five questions on monolithic deployment, layered responsibilities, module boundaries, architectural trade-offs and scenario-based selection.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-1-6-q1',
        prompt:
          'A team packages its storefront, catalogue, basket and order logic into one application that is built and released as a single unit. Which statement is accurate?',
        options: [
          {
            id: 'quiz-1-6-q1-a',
            label: 'It cannot be a monolith unless every capability lives in one source file.',
            isCorrect: false,
            explanation: 'Deployment shape defines a monolith; many separate classes can be packaged into one application.',
          },
          {
            id: 'quiz-1-6-q1-b',
            label: 'It must use one database table for all capabilities to qualify as monolithic.',
            isCorrect: false,
            explanation: 'Data topology is a separate choice; a monolith may use many tables or databases.',
          },
          {
            id: 'quiz-1-6-q1-c',
            label:
              'It is a monolithic deployment, and its internal components may still have clear responsibilities and boundaries.',
            isCorrect: true,
            explanation: 'One deployable unit says nothing by itself about how well the internal components are organized.',
          },
          {
            id: 'quiz-1-6-q1-d',
            label: 'Each capability must run in its own process for the application to be called monolithic.',
            isCorrect: false,
            explanation: 'Separate processes would describe a different deployment shape, not a monolith.',
          },
        ],
        explanation:
          'Separate deployment and internal structure: a monolith is one application, which may be tidy or tangled inside.',
      },
      {
        id: 'quiz-1-6-q2',
        prompt:
          'A product-details request reaches a layered application. Which description best reflects responsibility separation and dependency direction?',
        options: [
          {
            id: 'quiz-1-6-q2-a',
            label: 'The presentation endpoint queries the database directly and builds the domain rules.',
            isCorrect: false,
            explanation: 'That collapses presentation, business and data-access responsibilities into one place.',
          },
          {
            id: 'quiz-1-6-q2-b',
            label:
              'Presentation validates request shape and calls an application operation; business logic applies rules through data access, and the result returns upward.',
            isCorrect: true,
            explanation:
              'This is a common layered arrangement, though specific systems may define different dependency rules.',
          },
          {
            id: 'quiz-1-6-q2-c',
            label: 'Every layer must run as a separate network service for layering to exist.',
            isCorrect: false,
            explanation: 'Layers are logical responsibilities and can run inside one process and deployment unit.',
          },
          {
            id: 'quiz-1-6-q2-d',
            label: 'The data-access layer decides the HTTP status code returned to the browser.',
            isCorrect: false,
            explanation: 'HTTP representation belongs to presentation, not to persistence code.',
          },
        ],
        explanation:
          'Trace request and return paths: each layer owns a responsibility, and the chosen dependency rule should be stated.',
      },
      {
        id: 'quiz-1-6-q3',
        prompt:
          'In a modular monolith, the Orders module needs the current price of a product owned by Catalog. What respects the module boundary?',
        options: [
          {
            id: 'quiz-1-6-q3-a',
            label: 'Orders opens Catalog’s internal table to read the latest price.',
            isCorrect: false,
            explanation: 'Direct access to another module’s internal data breaks encapsulation and data ownership.',
          },
          {
            id: 'quiz-1-6-q3-b',
            label: 'Orders copies the Catalog table into its own schema and refreshes it independently.',
            isCorrect: false,
            explanation: 'Duplicating internal data creates stale copies and hides ownership rather than respecting the boundary.',
          },
          {
            id: 'quiz-1-6-q3-c',
            label: 'The boundary is already present because the classes sit in folders named Catalog and Orders.',
            isCorrect: false,
            explanation: 'Folder names do not enforce interfaces, encapsulation or controlled dependencies.',
          },
          {
            id: 'quiz-1-6-q3-d',
            label:
              'Catalog exposes a small public operation that Orders calls, while Catalog keeps its internal data and rules hidden.',
            isCorrect: true,
            explanation: 'A controlled interface makes the dependency explicit without exposing module internals.',
          },
        ],
        explanation:
          'A module interface is a contract even when the call is in-process; internal tables remain the owning module’s concern.',
      },
      {
        id: 'quiz-1-6-q4',
        prompt:
          'A team adds a new layer to every feature “for flexibility,” but most new classes only forward calls and map identical models. What is the strongest architectural concern?',
        options: [
          {
            id: 'quiz-1-6-q4-a',
            label:
              'The boundaries may add indirection and code without isolating a real change or ownership concern.',
            isCorrect: true,
            explanation: 'Pass-through layers provide the cost of abstraction without the benefit of separation.',
          },
          {
            id: 'quiz-1-6-q4-b',
            label: 'Each layer automatically gains independent scalability and a separate deployment pipeline.',
            isCorrect: false,
            explanation: 'Logical layers do not change deployment or scaling boundaries by themselves.',
          },
          {
            id: 'quiz-1-6-q4-c',
            label: 'Adding any layer always improves business ownership because more layers mean more structure.',
            isCorrect: false,
            explanation: 'Ownership comes from meaningful capability boundaries, not from layer count.',
          },
          {
            id: 'quiz-1-6-q4-d',
            label: 'The application has accidentally become a microservices architecture.',
            isCorrect: false,
            explanation: 'Microservices are independently deployed; extra in-process layers do not create them.',
          },
        ],
        explanation:
          'Justify boundaries by the change or ownership they protect; more structure is not automatically better architecture.',
      },
      {
        id: 'quiz-1-6-q5',
        prompt:
          'Four developers are building an evolving store. Requirements are likely to change, but no one has confirmed a need for independently deployed services. Which proposal is most defensible?',
        options: [
          {
            id: 'quiz-1-6-q5-a',
            label: 'Adopt microservices immediately because an evolving product will eventually need them.',
            isCorrect: false,
            explanation: 'Speculative service boundaries add contracts and operations before evidence justifies them.',
          },
          {
            id: 'quiz-1-6-q5-b',
            label: 'Use one deployment unit and let every capability read every other capability’s internals for speed.',
            isCorrect: false,
            explanation: 'Shared deployment does not require unrestricted coupling; boundaries still matter.',
          },
          {
            id: 'quiz-1-6-q5-c',
            label:
              'Start with one deployable application, use layers or module interfaces where boundaries are clear, and revisit if ownership or deployment needs change.',
            isCorrect: true,
            explanation: 'This fits current constraints while naming evidence that would justify more complexity.',
          },
          {
            id: 'quiz-1-6-q5-d',
            label: 'Give every module a separate physical database because modularity requires it.',
            isCorrect: false,
            explanation: 'Logical data ownership can exist without separate physical databases.',
          },
        ],
        explanation:
          'Select architecture from requirements and constraints, then state the signals that would justify a later change.',
      },
    ],
  },
  {
    id: 'quiz-2-1',
    title: 'Network Foundations — knowledge check',
    description:
      'Five questions on IP addresses, ports, TCP handshake and reliability, UDP behavior, sockets and practical application communication.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-2-1-q1',
        prompt:
          'A browser is talking to a store backend. Which statement best distinguishes the server IP address from the application endpoint?',
        options: [
          {
            id: 'quiz-2-1-q1-a',
            label: 'The IP address identifies the server process, so a port is only needed by the client.',
            isCorrect: false,
            explanation: 'An IP address locates a network endpoint; it does not select one of several application processes on that host.',
          },
          {
            id: 'quiz-2-1-q1-b',
            label: 'The IP address identifies a network endpoint context; the transport protocol and port identify the application service on that host.',
            isCorrect: true,
            explanation: 'This combines host location with protocol-specific application identity, which is the useful endpoint model.',
          },
          {
            id: 'quiz-2-1-q1-c',
            label: 'A private IP address is always globally reachable, so destination ports are unnecessary.',
            isCorrect: false,
            explanation: 'Private addresses are not globally routed on the public Internet, and ports are still needed to select an application.',
          },
          {
            id: 'quiz-2-1-q1-d',
            label: 'The port replaces the IP address after the TCP handshake completes.',
            isCorrect: false,
            explanation: 'Both addresses and ports remain in every packet; nothing replaces the IP address with a port.',
          },
        ],
        explanation:
          'Keep the layers separate: IP helps reach the host, while protocol plus port identifies the application on that host.',
      },
      {
        id: 'quiz-2-1-q2',
        prompt:
          'An illustrative TCP flow is 192.168.1.20:51524 → 203.0.113.10:443. What do 51524 and 443 represent?',
        options: [
          {
            id: 'quiz-2-1-q2-a',
            label: 'They are two server listening ports used for load balancing.',
            isCorrect: false,
            explanation: 'The source port belongs to the client; only 443 is the server destination port in this example.',
          },
          {
            id: 'quiz-2-1-q2-b',
            label: '443 is the client ephemeral port and 51524 is the conventional HTTPS server port.',
            isCorrect: false,
            explanation: 'The direction is reversed: clients usually use ephemeral ports and HTTPS servers conventionally listen on 443.',
          },
          {
            id: 'quiz-2-1-q2-c',
            label:
              '51524 is a client-chosen ephemeral source port; 443 is the conventional HTTPS listening port, and TCP/443 is distinct from UDP/443.',
            isCorrect: true,
            explanation: 'This names source and destination roles correctly and remembers that TCP and UDP have separate port spaces.',
          },
          {
            id: 'quiz-2-1-q2-d',
            label: 'They are physical connector numbers on the client and server network cards.',
            isCorrect: false,
            explanation: 'Port numbers are 16-bit transport-layer values, not hardware connectors.',
          },
        ],
        explanation:
          'Source and destination endpoints need both IP and port, with the transport protocol supplying the port space.',
      },
      {
        id: 'quiz-2-1-q3',
        prompt:
          'Why does TCP send SYN, SYN-ACK and ACK before an HTTP request is carried on a traditional HTTPS connection?',
        options: [
          {
            id: 'quiz-2-1-q3-a',
            label: 'To encrypt the HTTP request before any address is known.',
            isCorrect: false,
            explanation: 'Encryption is handled by TLS above TCP; the TCP handshake establishes transport state first.',
          },
          {
            id: 'quiz-2-1-q3-b',
            label:
              'To establish connection state and exchange initial sequence numbers so bytes can later be acknowledged and ordered.',
            isCorrect: true,
            explanation: 'The handshake agrees on sequence-number starting points and confirms both directions of communication.',
          },
          {
            id: 'quiz-2-1-q3-c',
            label: 'To guarantee that the server will successfully process the business operation.',
            isCorrect: false,
            explanation: 'TCP delivery does not guarantee validation, processing or database commit by the application.',
          },
          {
            id: 'quiz-2-1-q3-d',
            label: 'To resolve the server hostname into an IP address.',
            isCorrect: false,
            explanation: 'DNS resolution happens before the transport connection and is a separate mechanism.',
          },
        ],
        explanation:
          'The three-way handshake is about transport connection state, not encryption, DNS or application success.',
      },
      {
        id: 'quiz-2-1-q4',
        prompt:
          'A real-time voice feature can tolerate an occasional dropped packet but not late playback. Which reasoning fits UDP best?',
        options: [
          {
            id: 'quiz-2-1-q4-a',
            label: 'TCP must always be used because any lost packet is unacceptable in every system.',
            isCorrect: false,
            explanation: 'For late media, retransmitting stale data can be worse than skipping it.',
          },
          {
            id: 'quiz-2-1-q4-b',
            label: 'UDP guarantees ordered delivery, so the media application never needs sequence information.',
            isCorrect: false,
            explanation: 'UDP provides no built-in ordering guarantee; applications may add sequence data when useful.',
          },
          {
            id: 'quiz-2-1-q4-c',
            label:
              'UDP avoids TCP-style retransmission of stale packets, while the application can add selective recovery or concealment where it helps.',
            isCorrect: true,
            explanation: 'This captures the timeliness trade-off without claiming that UDP removes all correctness work.',
          },
          {
            id: 'quiz-2-1-q4-d',
            label: 'UDP port 443 is the same connection as TCP port 443, so the transport choice makes no difference.',
            isCorrect: false,
            explanation: 'TCP and UDP have separate port spaces and different transport behavior.',
          },
        ],
        explanation:
          'Evaluate transport choice by workload needs: timeliness, loss tolerance and what the application must implement itself.',
      },
      {
        id: 'quiz-2-1-q5',
        prompt: 'What happens when a server accepts an incoming TCP connection?',
        options: [
          {
            id: 'quiz-2-1-q5-a',
            label:
              'The listening socket yields a connected socket associated with that flow, and the application reads and writes a byte stream through it.',
            isCorrect: true,
            explanation: 'The connected socket represents the source and destination endpoints and protocol for that conversation.',
          },
          {
            id: 'quiz-2-1-q5-b',
            label: 'The server replaces its IP address with the client IP address for the rest of the session.',
            isCorrect: false,
            explanation: 'Both source and destination addresses remain in packets throughout the connection.',
          },
          {
            id: 'quiz-2-1-q5-c',
            label: 'The socket becomes a physical connector that can be inspected on the network card.',
            isCorrect: false,
            explanation: 'A socket is an operating-system endpoint for application communication, not hardware.',
          },
          {
            id: 'quiz-2-1-q5-d',
            label: 'The DNS resolver automatically opens a database connection for the application.',
            isCorrect: false,
            explanation: 'DNS maps names to addresses; backend dependencies are separate application connections.',
          },
        ],
        explanation:
          'Sockets are the application view of transport communication; accepting a TCP connection creates a connected endpoint for that flow.',
      },
    ],
  },
  {
    id: 'quiz-2-2',
    title: 'HTTP Deep Dive — knowledge check',
    description:
      'Five applied questions on HTTP message semantics, persistent connections, HTTP/2 multiplexing, HTTP/3 over QUIC, headers, compression and protocol negotiation.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-2-2-q1',
        prompt:
          'An API team enables HTTP persistent connections for an HTTP/1.1 service. Which outcome should they expect, and which limitation remains?',
        options: [
          {
            id: 'quiz-2-2-q1-a',
            label: 'Every request becomes concurrent on one connection, so the team can close all other sockets.',
            isCorrect: false,
            explanation:
              'HTTP/1.1 does not multiplex normal exchanges. Requests on one connection still wait their turn unless the browser uses multiple connections.',
          },
          {
            id: 'quiz-2-2-q1-b',
            label: 'The operating system starts sending TCP keepalive probes, which prove the API is healthy.',
            isCorrect: false,
            explanation:
              'TCP keepalive is a separate transport-liveness mechanism controlled by socket and operating-system settings. It is not enabled by HTTP persistence and is not an application health check.',
          },
          {
            id: 'quiz-2-2-q1-c',
            label: 'The connection is reused for successive request-response exchanges, removing repeated TCP and TLS setup, but exchanges on it remain sequential.',
            isCorrect: true,
            explanation:
              'HTTP/1.1 keeps the connection open by default. Reuse avoids repeated handshake and TLS work, while one connection still handles one response at a time in normal browser behavior.',
          },
          {
            id: 'quiz-2-2-q1-d',
            label: 'Headers are compressed with HPACK, so the connection no longer needs response body boundaries.',
            isCorrect: false,
            explanation:
              'HPACK belongs to HTTP/2, not HTTP/1.1. HTTP/1.1 responses still need Content-Length or chunked coding so the client can find the body boundary.',
          },
        ],
        explanation:
          'Persistence changes connection reuse, not concurrency. Name the layer: HTTP exchange reuse removes setup cost, while TCP keepalive probes test idle transport liveness.',
      },
      {
        id: 'quiz-2-2-q2',
        prompt:
          'A page uses HTTP/2 over TCP. Three streams carry a stylesheet, an image and an API response. A packet carrying stylesheet bytes is lost, and the other bytes arrive but are not delivered to the browser yet. Which explanation is correct?',
        options: [
          {
            id: 'quiz-2-2-q2-a',
            label: 'HTTP/2 stream IDs are reassigned after loss, so the image and API responses must be requested again.',
            isCorrect: false,
            explanation:
              'Stream IDs remain stable. HTTP/2 can interleave frames correctly; it is the underlying transport that holds later ordered bytes after a gap.',
          },
          {
            id: 'quiz-2-2-q2-b',
            label: 'HPACK cannot decode the image headers until the stylesheet response finishes.',
            isCorrect: false,
            explanation:
              'HPACK header decoding is not the cause of this stall. The scenario describes lost bytes on the shared TCP byte stream, not a dynamic-table dependency.',
          },
          {
            id: 'quiz-2-2-q2-c',
            label: 'ALPN failed, so the browser silently switched the three streams to HTTP/1.1.',
            isCorrect: false,
            explanation:
              'ALPN negotiates the application protocol during connection setup. It does not dynamically convert individual streams after packet loss.',
          },
          {
            id: 'quiz-2-2-q2-d',
            label: 'TCP delivers one ordered byte stream, so the lost bytes block unrelated HTTP/2 streams until retransmission fills the gap.',
            isCorrect: true,
            explanation:
              'This is transport-level head-of-line blocking. HTTP/2 multiplexes streams, but TCP ordering still holds later bytes until missing earlier bytes arrive.',
          },
        ],
        explanation:
          'Separate HTTP-level serialization from transport-level blocking. HTTP/2 removes sequential exchanges on one connection, but TCP ordered delivery can still pause unrelated streams after loss.',
      },
      {
        id: 'quiz-2-2-q3',
        prompt:
          'An HTTP/2 response contains a compressible JSON body and the header Content-Encoding: br. Which statement accurately describes what happens?',
        options: [
          {
            id: 'quiz-2-2-q3-a',
            label: 'HPACK compressed the JSON body because HTTP/2 always compresses response payloads.',
            isCorrect: false,
            explanation:
              'HPACK compresses header fields only. Body representation is controlled separately by Accept-Encoding and Content-Encoding.',
          },
          {
            id: 'quiz-2-2-q3-b',
            label: 'Brotli compressed the body, while HPACK may have compressed the header fields on that HTTP/2 connection.',
            isCorrect: true,
            explanation:
              'Content-Encoding: br reports a Brotli-compressed representation body. HPACK is the separate HTTP/2 header-compression mechanism using static and dynamic tables.',
          },
          {
            id: 'quiz-2-2-q3-c',
            label: 'The br value tells the client to negotiate HTTP/3 with QPACK instead of staying on HTTP/2.',
            isCorrect: false,
            explanation:
              'Body encodings and protocol selection are independent. QPACK compresses HTTP/3 headers; Content-Encoding: br neither selects HTTP/3 nor replaces QPACK.',
          },
          {
            id: 'quiz-2-2-q3-d',
            label: 'The header is only metadata, so the JSON body cannot be compressed and must be sent unchanged.',
            isCorrect: false,
            explanation:
              'Content-Encoding is metadata that describes how the body representation was encoded. The browser decodes it before the application reads the JSON.',
          },
        ],
        explanation:
          'Keep compression layers distinct: gzip and Brotli compress bodies with Content-Encoding; HPACK and QPACK compress headers and are tied to the HTTP version and connection.',
      },
      {
        id: 'quiz-2-2-q4',
        prompt:
          'A mobile client using HTTP/3 moves from Wi-Fi to cellular during a download, and one QUIC stream experiences packet loss. Which explanation best matches HTTP/3 behavior?',
        options: [
          {
            id: 'quiz-2-2-q4-a',
            label: 'UDP guarantees delivery, so no stream can lose packets and the network change is invisible.',
            isCorrect: false,
            explanation:
              'UDP alone does not guarantee delivery. QUIC adds reliability, congestion control and stream management above UDP, and network changes can still affect the path.',
          },
          {
            id: 'quiz-2-2-q4-b',
            label: 'QUIC connection IDs can let the connection survive some network changes, and loss on one stream need not block delivery on unrelated streams.',
            isCorrect: true,
            explanation:
              'HTTP/3 uses QUIC connection IDs for migration and independent streams for delivery state. Congestion control is still shared, so severe path problems can slow every stream.',
          },
          {
            id: 'quiz-2-2-q4-c',
            label: 'TCP keepalive preserves the TCP connection across the address change because HTTP/3 still runs over TCP.',
            isCorrect: false,
            explanation:
              'HTTP/3 runs over QUIC and UDP, not TCP. TCP keepalive is an idle-peer probe and does not preserve a connection across an address change.',
          },
          {
            id: 'quiz-2-2-q4-d',
            label: 'QUIC disables congestion control for independent streams, so the remaining streams are unaffected by the change.',
            isCorrect: false,
            explanation:
              'QUIC still applies congestion control at connection level. Independent streams reduce cross-stream blocking but do not remove network limits.',
          },
        ],
        explanation:
          'HTTP/3 benefits come from QUIC stream independence, integrated TLS 1.3 and connection migration, not from UDP being inherently faster or reliable by itself.',
      },
      {
        id: 'quiz-2-2-q5',
        prompt:
          'A browser offers h2 and http/1.1 through TLS ALPN. A CDN supports h2 and h3, while the origin application only speaks HTTP/1.1. What should the team expect?',
        options: [
          {
            id: 'quiz-2-2-q5-a',
            label: 'Setting a response header such as Cache-Control forces the browser to use HTTP/3 end to end.',
            isCorrect: false,
            explanation:
              'Response headers do not select the transport protocol. Protocol selection happens in the TLS or QUIC handshake and must be supported by each endpoint.',
          },
          {
            id: 'quiz-2-2-q5-b',
            label: 'ALPN always chooses the newest protocol in the browser list, so the origin will automatically receive h3.',
            isCorrect: false,
            explanation:
              'Negotiation requires overlap between client and server support. The origin cannot receive a protocol it does not implement.',
          },
          {
            id: 'quiz-2-2-q5-c',
            label: 'Blocking UDP/443 has no effect because HTTP/2 and HTTP/3 both use TCP.',
            isCorrect: false,
            explanation:
              'HTTP/2 uses TCP, but HTTP/3 uses QUIC over UDP, commonly on UDP/443. Blocking that traffic can prevent HTTP/3 negotiation and cause fallback.',
          },
          {
            id: 'quiz-2-2-q5-d',
            label: 'The browser may negotiate h2 to the CDN while the CDN uses HTTP/1.1 to the origin; the team should measure the protocol actually used on each hop.',
            isCorrect: true,
            explanation:
              'A CDN can terminate the client protocol and use a different protocol toward the origin. Negotiation depends on support at each hop, so observation is better than assumption.',
          },
        ],
        explanation:
          'A version preference is not a guarantee. ALPN and QUIC negotiation choose from actual support, and intermediaries can change the protocol between client and origin.',
      },
    ],
  },
  {
    id: 'quiz-2-3',
    title: 'Communication Patterns — knowledge check',
    description:
      'Five applied questions on synchronous request-response behavior, asynchronous lifecycles, architectural trade-offs, hybrid workflows and failure handling.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-2-3-q1',
        prompt:
          'A profile API awaits a profile service before it can answer the browser. Which statement about this interaction is accurate?',
        options: [
          {
            id: 'quiz-2-3-q1-a',
            label: 'Using async and await makes the communication asynchronous, so the browser no longer waits for the profile.',
            isCorrect: false,
            explanation:
              'async and await can avoid blocking a thread, but the HTTP caller still waits for the profile before it can continue. Communication remains synchronous from the caller point of view.',
          },
          {
            id: 'quiz-2-3-q1-b',
            label: 'Synchronous communication means the whole server is single-threaded and cannot serve other requests during this wait.',
            isCorrect: false,
            explanation:
              'A synchronous relationship does not constrain the server threading model. A server can handle many other requests while this caller waits for its result.',
          },
          {
            id: 'quiz-2-3-q1-c',
            label: 'The API can return a successful response before the profile service finishes as long as it uses an HTTP client.',
            isCorrect: false,
            explanation:
              'The API needs the profile to build this response. Using an HTTP client does not remove the dependency or the caller wait.',
          },
          {
            id: 'quiz-2-3-q1-d',
            label: 'The browser response time includes the downstream call, and a downstream timeout can propagate back through the API.',
            isCorrect: true,
            explanation:
              'The dependent call is on the critical request path. Its latency accumulates into the caller wait, and its failure can become an API failure.',
          },
        ],
        explanation:
          'Synchronous communication is defined by the caller waiting for the result, not by the implementation technique used while waiting.',
      },
      {
        id: 'quiz-2-3-q2',
        prompt:
          'An order endpoint saves an order, records an invoice job and returns 202 Accepted with a status URL. Which description of the lifecycle is correct?',
        options: [
          {
            id: 'quiz-2-3-q2-a',
            label: 'The 202 response proves the invoice was generated because the endpoint returned successfully.',
            isCorrect: false,
            explanation:
              '202 Accepted reports acceptance for processing. Final success depends on later worker processing and must be observed through stored status.',
          },
          {
            id: 'quiz-2-3-q2-b',
            label: 'The endpoint is a producer, the recorded job represents the work, a consumer processes it later, and status reflects completion after processing.',
            isCorrect: true,
            explanation:
              'This is the core async lifecycle: durable acceptance, deferred consumer processing, acknowledgment after success and status observation for clients.',
          },
          {
            id: 'quiz-2-3-q2-c',
            label: 'A message broker is required; otherwise the interaction is synchronous by definition.',
            isCorrect: false,
            explanation:
              'A broker is one common implementation. Durable tables, schedulers and other stored-work mechanisms can also support asynchronous communication.',
          },
          {
            id: 'quiz-2-3-q2-d',
            label: 'The consumer should acknowledge the job before processing so the response can be considered complete.',
            isCorrect: false,
            explanation:
              'Acknowledging before processing can lose work if the consumer fails. Acknowledgment normally follows successful processing.',
          },
        ],
        explanation:
          'Acceptance and completion are separate events in an asynchronous workflow, and reliable designs make both observable.',
      },
      {
        id: 'quiz-2-3-q3',
        prompt:
          'A team is comparing synchronous and asynchronous communication for a busy order system. Which trade-off assessment is best?',
        options: [
          {
            id: 'quiz-2-3-q3-a',
            label: 'Asynchronous communication always reduces total latency and removes the need to monitor failures.',
            isCorrect: false,
            explanation:
              'It can shorten the initiating request, but completion still takes time and failures need separate monitoring.',
          },
          {
            id: 'quiz-2-3-q3-b',
            label: 'Synchronous communication cannot scale and should be replaced everywhere by queues.',
            isCorrect: false,
            explanation:
              'Synchronous designs can scale for bounded operations. Pattern choice depends on immediacy and requirements, not fashion.',
          },
          {
            id: 'quiz-2-3-q3-c',
            label: 'Asynchronous processing can decouple workloads and buffer spikes, but it adds eventual consistency, duplicate handling and observability costs.',
            isCorrect: true,
            explanation:
              'This captures both sides of the trade-off: decoupling and buffering are valuable, while status, retries and monitoring become explicit responsibilities.',
          },
          {
            id: 'quiz-2-3-q3-d',
            label: 'Publishing a message guarantees reliable processing, so idempotency is unnecessary for consumers.',
            isCorrect: false,
            explanation:
              'Messages can be redelivered and handlers can run more than once. Reliability requires duplicate-safe processing and failure handling.',
          },
        ],
        explanation:
          'Evaluate both patterns against latency, coupling, failure behavior, consistency and operational complexity instead of assuming one is universally superior.',
      },
      {
        id: 'quiz-2-3-q4',
        prompt:
          'Which e-commerce order design best uses synchronous and asynchronous patterns together?',
        options: [
          {
            id: 'quiz-2-3-q4-a',
            label: 'Validate the cart and persist the order synchronously, return 202 Accepted with a status URL, then defer email, invoice and analytics work.',
            isCorrect: true,
            explanation:
              'Immediate validation and acceptance answer the customer decision, while independent follow-up work leaves the user-facing critical path.',
          },
          {
            id: 'quiz-2-3-q4-b',
            label: 'Defer cart validation and order persistence so the customer receives an instant confirmation before the order exists.',
            isCorrect: false,
            explanation:
              'The customer needs to know whether the order was accepted. Deferring the core acceptance decision creates a misleading user experience.',
          },
          {
            id: 'quiz-2-3-q4-c',
            label: 'Keep every step synchronous so there is only one response and no eventual consistency.',
            isCorrect: false,
            explanation:
              'That extends the critical path to notifications, invoices and analytics and spreads their failures into order acceptance.',
          },
          {
            id: 'quiz-2-3-q4-d',
            label: 'Return 201 Created after queuing the email and treat acceptance as final completion of invoice and analytics.',
            isCorrect: false,
            explanation:
              'A response should be honest about what completed. If follow-up work is pending, status must distinguish acceptance from completion.',
          },
        ],
        explanation:
          'Hybrid workflows keep immediate decisions synchronous and defer only work that does not change the answer the caller needs now.',
      },
      {
        id: 'quiz-2-3-q5',
        prompt:
          'A payment provider is intermittently failing and a notification worker sometimes redelivers messages. Which reliability approach is most appropriate?',
        options: [
          {
            id: 'quiz-2-3-q5-a',
            label: 'Remove all timeouts so requests keep waiting until the provider recovers.',
            isCorrect: false,
            explanation:
              'Indefinite waiting keeps requests unresolved and consumes resources. Bounded waits and explicit failure decisions are needed.',
          },
          {
            id: 'quiz-2-3-q5-b',
            label: 'Retry immediately and repeatedly on every failure; duplicate effects are acceptable because retries are free.',
            isCorrect: false,
            explanation:
              'Blind retries amplify outages and can duplicate side effects. Backoff and idempotency are needed.',
          },
          {
            id: 'quiz-2-3-q5-c',
            label: 'Use finite timeouts, bounded retries with backoff and idempotency keys; acknowledge async work after processing and make duplicate delivery safe.',
            isCorrect: true,
            explanation:
              'This combination bounds waiting, avoids retry storms, protects against duplicate effects and makes redelivery safer.',
          },
          {
            id: 'quiz-2-3-q5-d',
            label: 'Acknowledge messages as soon as they are delivered and delete failed work without monitoring.',
            isCorrect: false,
            explanation:
              'Early acknowledgment and silent deletion lose work and hide failures. Failed work needs bounded retries and a visible review path.',
          },
        ],
        explanation:
          'Reliability comes from explicit timeout, retry and idempotency decisions, not from assuming the communication pattern alone guarantees success.',
      },
    ],
  },
  {
    id: 'quiz-2-4',
    title: 'API Communication — knowledge check',
    description:
      'Five applied questions on REST resource design, GraphQL queries and resolvers, protobuf contracts, gRPC streaming and API-style selection.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-2-4-q1',
        prompt:
          'A catalogue API exposes products. Which endpoint design best reflects REST resource-oriented principles?',
        options: [
          {
            id: 'quiz-2-4-q1-a',
            label: 'POST /api/getProduct with the identifier in the body, returning 200 even when no product exists.',
            isCorrect: false,
            explanation:
              'This hides a read behind a custom verb and always reports success. REST favours a resource identifier, a meaningful method and an honest status code.',
          },
          {
            id: 'quiz-2-4-q1-b',
            label: 'GET /api/products/42 that returns internal database rows and omits any representation boundary.',
            isCorrect: false,
            explanation:
              'REST returns a representation of the resource, not internal storage details. The representation boundary lets the server evolve its storage independently.',
          },
          {
            id: 'quiz-2-4-q1-c',
            label: 'GET /api/products/42 returns a product representation or 404, while POST /api/products creates a product.',
            isCorrect: true,
            explanation:
              'The URI identifies the resource, GET reads it, POST creates in the collection, and 404 accurately reports a missing resource.',
          },
          {
            id: 'quiz-2-4-q1-d',
            label: 'PUT /api/products/42 for a one-field change and DELETE /api/products/42 with a JSON body describing the reason.',
            isCorrect: false,
            explanation:
              'PUT conventionally replaces the resource; PATCH fits a partial change. DELETE normally needs only the resource identifier, not a descriptive body.',
          },
        ],
        explanation:
          'REST design aligns resource identifiers, HTTP methods, representations and status codes instead of inventing custom verbs or leaking internal data.',
      },
      {
        id: 'quiz-2-4-q2',
        prompt:
          'A mobile client wants product name, price and image; a desktop client also wants reviews. Which statement about a GraphQL design is accurate?',
        options: [
          {
            id: 'quiz-2-4-q2-a',
            label: 'Both clients can query one typed schema for different fields, but resolvers still perform backend work and an N+1 problem is possible.',
            isCorrect: true,
            explanation:
              'Field selection shapes the response, while resolvers determine how data is fetched. Repeated related lookups can create N+1 calls unless batching is designed.',
          },
          {
            id: 'quiz-2-4-q2-b',
            label: 'Because both requests are single GraphQL queries, each one is guaranteed to issue exactly one database query.',
            isCorrect: false,
            explanation:
              'A GraphQL request can trigger many resolver calls and downstream queries. There is no automatic one-to-one mapping to database work.',
          },
          {
            id: 'quiz-2-4-q2-c',
            label: 'GraphQL clients must call a separate endpoint for every field they need.',
            isCorrect: false,
            explanation:
              'Clients normally send one query document with a selection set to a GraphQL endpoint. The resolvers handle the field work.',
          },
          {
            id: 'quiz-2-4-q2-d',
            label: 'The schema is optional because clients can request any field name they invent.',
            isCorrect: false,
            explanation:
              'GraphQL is schema-driven. The server validates requested fields and arguments against declared types before execution.',
          },
        ],
        explanation:
          'GraphQL gives clients field-level flexibility through a validated schema, but that flexibility moves complexity into resolvers and backend data access.',
      },
      {
        id: 'quiz-2-4-q3',
        prompt:
          'A team changes a protobuf field from string id = 1 to int32 id = 1 and later reuses field number 1 for a new field. What is the main compatibility risk?',
        options: [
          {
            id: 'quiz-2-4-q3-a',
            label: 'Protobuf is text-based, so old and new services can read each other without any contract rules.',
            isCorrect: false,
            explanation:
              'Protobuf uses binary serialization on the wire. Contracts and field numbers still govern how bytes are interpreted.',
          },
          {
            id: 'quiz-2-4-q3-b',
            label: 'Field numbers stop mattering after code generation because generated stubs carry the names.',
            isCorrect: false,
            explanation:
              'Generated code still encodes and decodes field numbers. Names are not transmitted as the stable wire identity in protobuf binary messages.',
          },
          {
            id: 'quiz-2-4-q3-c',
            label: 'Schema evolution is automatic, so any change is safe if both services are rebuilt at the same time.',
            isCorrect: false,
            explanation:
              'Even coordinated deployment does not make unsafe field reuse a good contract practice. Older messages, logs or partially deployed clients may still exist.',
          },
          {
            id: 'quiz-2-4-q3-d',
            label: 'Field numbers identify fields on the wire; changing a type or reusing a number can make peers misread messages.',
            isCorrect: true,
            explanation:
              'Compatibility comes from preserving field identities. Add new fields with fresh numbers and deprecate old ones deliberately.',
          },
        ],
        explanation:
          'Protobuf supports compatible evolution, but only when field numbers and meanings are treated as a stable contract.',
      },
      {
        id: 'quiz-2-4-q4',
        prompt:
          'One service sends continuous price updates after a single request. Another uploads a sequence of telemetry readings and then receives one summary. Which gRPC pairing fits best?',
        options: [
          {
            id: 'quiz-2-4-q4-a',
            label: 'Unary RPC for both, because every exchange has a first request and a final response.',
            isCorrect: false,
            explanation:
              'Unary sends exactly one request and one response. It does not express a stream of updates or uploads.',
          },
          {
            id: 'quiz-2-4-q4-b',
            label: 'Server streaming for price updates and client streaming for the telemetry upload.',
            isCorrect: true,
            explanation:
              'Server streaming sends many responses to one request; client streaming sends many requests before one response. Both share one RPC contract.',
          },
          {
            id: 'quiz-2-4-q4-c',
            label: 'Bidirectional streaming is required for both because all streams must be two-way.',
            isCorrect: false,
            explanation:
              'Only bidirectional streaming allows both sides to send sequences independently. One-way streaming fits these two examples better.',
          },
          {
            id: 'quiz-2-4-q4-d',
            label: 'Repeated unrelated REST requests are the gRPC client-streaming pattern with a different name.',
            isCorrect: false,
            explanation:
              'A gRPC stream is one ordered RPC conversation with a shared contract and lifecycle, not independent requests.',
          },
        ],
        explanation:
          'Choose the RPC shape from the direction of the message sequence and how the stream ends, not from the mere existence of a request and response.',
      },
      {
        id: 'quiz-2-4-q5',
        prompt:
          'A platform has a public web app, a mobile app with different product data needs, frequent order-to-inventory calls and a continuous analytics feed. Which architecture decision is best defended?',
        options: [
          {
            id: 'quiz-2-4-q5-a',
            label: 'Use native gRPC directly from every browser and skip a gateway, because one style is simpler to operate.',
            isCorrect: false,
            explanation:
              'Browser gRPC usually needs gRPC-Web through a proxy or gateway with feature limits. Forcing one style ignores real client constraints.',
          },
          {
            id: 'quiz-2-4-q5-b',
            label: 'Move all internal service calls to GraphQL because one request always reduces backend latency.',
            isCorrect: false,
            explanation:
              'GraphQL does not guarantee lower latency and introduces resolver, batching and query-cost concerns. Internal service contracts may fit gRPC better.',
          },
          {
            id: 'quiz-2-4-q5-c',
            label: 'Use REST for stable public resources, GraphQL where clients need different fields, gRPC for internal contracts and streaming, then budget for extra tooling and monitoring.',
            isCorrect: true,
            explanation:
              'Each boundary matches its consumer needs, and the answer honestly names the added contracts, security rules and observability cost of multiple styles.',
          },
          {
            id: 'quiz-2-4-q5-d',
            label: 'Choose one style for the whole platform because mixing API styles is never acceptable.',
            isCorrect: false,
            explanation:
              'A single style can be valid, but it is not a rule. Hybrid designs can be appropriate when their operational cost is understood and owned.',
          },
        ],
        explanation:
          'Defensible API selection starts from consumers and constraints, then names benefits, costs and valid alternatives instead of declaring a universal winner.',
      },
    ],
  },
  {
    id: 'quiz-2-5',
    title: 'Real-Time Communication — knowledge check',
    description:
      'Five applied questions on polling, the WebSocket handshake, SSE streams, failure recovery and protocol selection.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-2-5-q1',
        prompt:
          'In the commonly deployed HTTP/1.1 WebSocket opening handshake, which combination correctly describes what happens?',
        options: [
          {
            id: 'quiz-2-5-q1-a',
            label: 'The client sends ordinary GET requests on a timer and the server returns the latest snapshot each time.',
            isCorrect: false,
            explanation:
              'That describes regular polling, not a WebSocket. Polling repeats whole HTTP requests, while a WebSocket upgrades a connection once.',
          },
          {
            id: 'quiz-2-5-q1-b',
            label: 'The client sends Upgrade: websocket, Connection: Upgrade and Sec-WebSocket-Key, and the server replies 101 Switching Protocols before frames are exchanged.',
            isCorrect: true,
            explanation:
              'This is the HTTP/1.1 opening handshake. After the 101 response the connection carries WebSocket frames rather than a new HTTP request and response per message.',
          },
          {
            id: 'quiz-2-5-q1-c',
            label: 'The browser sends a text/event-stream response and the client reconnects with Last-Event-ID after every event.',
            isCorrect: false,
            explanation:
              'text/event-stream and Last-Event-ID belong to Server-Sent Events, which is one-way and uses EventSource; they are not a WebSocket handshake.',
          },
          {
            id: 'quiz-2-5-q1-d',
            label: 'The server holds one HTTP request open, responds when data arrives, and the client immediately opens another request.',
            isCorrect: false,
            explanation:
              'That is Long Polling. It stays in request-response form and does not upgrade to a bidirectional frame connection.',
          },
        ],
        explanation:
          'The HTTP/1.1 WebSocket bootstrap uses upgrade headers and a client key, then a 101 response. HTTP/2 and HTTP/3 bootstrap WebSockets differently, so this answer is specific to the common HTTP/1.1 case.',
      },
      {
        id: 'quiz-2-5-q2',
        prompt:
          'A notification centre pushes alerts to browsers, and users occasionally mark alerts as read. Which design best fits SSE?',
        options: [
          {
            id: 'quiz-2-5-q2-a',
            label: 'Send alerts and mark-read commands as frames on one EventSource connection, because SSE is bidirectional.',
            isCorrect: false,
            explanation:
              'SSE is one-way. EventSource cannot send commands back; marking an alert read needs a separate HTTP request.',
          },
          {
            id: 'quiz-2-5-q2-b',
            label: 'Have the browser poll every second and discard any event ids, because SSE cannot reconnect automatically.',
            isCorrect: false,
            explanation:
              'EventSource reconnects automatically and exposes event ids for recovery, so constant polling is unnecessary for this scenario.',
          },
          {
            id: 'quiz-2-5-q2-c',
            label: 'Open a WebSocket instead, because HTTP responses with text/event-stream are blocked by every load balancer.',
            isCorrect: false,
            explanation:
              'SSE works through ordinary HTTP infrastructure, although buffering and idle timeouts need configuration. It is not blocked by every load balancer.',
          },
          {
            id: 'quiz-2-5-q2-d',
            label: 'Stream alerts as named SSE events with id fields, and send mark-read commands as ordinary HTTP POST requests.',
            isCorrect: true,
            explanation:
              'The direction fits SSE: the server pushes events and the browser answers with separate commands. Event ids support recovery when the server retains events for replay.',
          },
        ],
        explanation:
          'SSE fits mainly server-to-browser updates. It provides browser-managed reconnection but no native client-to-server channel, so commands belong on a separate HTTP path.',
      },
      {
        id: 'quiz-2-5-q3',
        prompt:
          'Which statement accurately describes the Long Polling request lifecycle?',
        options: [
          {
            id: 'quiz-2-5-q3-a',
            label: 'The client opens one request, the server holds it until data exists or a timeout expires, then the client processes the response and immediately opens another request.',
            isCorrect: true,
            explanation:
              'This is the core Long Polling loop. It reduces empty responses but still repeats requests and holds server resources while waiting.',
          },
          {
            id: 'quiz-2-5-q3-b',
            label: 'The client upgrades the connection once and both sides send frames without opening another HTTP request.',
            isCorrect: false,
            explanation:
              'That describes WebSockets. Long Polling remains request-response and ends each held request after one response.',
          },
          {
            id: 'quiz-2-5-q3-c',
            label: 'The server keeps one text/event-stream response open and writes many events into it without reconnecting.',
            isCorrect: false,
            explanation:
              'That is SSE. Long Polling does not keep a single response open for many events; it reconnects after every response.',
          },
          {
            id: 'quiz-2-5-q3-d',
            label: 'The client never reconnects after a successful response because the server keeps the request open forever.',
            isCorrect: false,
            explanation:
              'A held request cannot stay open forever: timeouts and data end it. The client must reconnect after every response, whether data arrived or the timeout won.',
          },
        ],
        explanation:
          'Long Polling delays the response until data or a bounded timeout, then reconnects. It is not a permanent connection and it is not the same as regular polling.',
      },
      {
        id: 'quiz-2-5-q4',
        prompt:
          'A chat service runs three application instances behind a load balancer. Clients connected to one instance must receive messages published by users connected to another. What is the most defensible scaling answer?',
        options: [
          {
            id: 'quiz-2-5-q4-a',
            label: 'Assume the transport guarantees delivery, so no application-level recovery or coordination is needed.',
            isCorrect: false,
            explanation:
              'WebSocket frames do not guarantee application delivery, and a load balancer does not share connection state between instances.',
          },
          {
            id: 'quiz-2-5-q4-b',
            label: 'Use sticky sessions and conclude the design is complete because every client stays on one instance permanently.',
            isCorrect: false,
            explanation:
              'Sticky sessions help locality but fail during failover and deploys, and they do not solve delivering a publisher event to clients on another instance.',
          },
          {
            id: 'quiz-2-5-q4-c',
            label: 'Use a shared coordination option such as pub/sub for cross-instance fan-out, track sequence ids for recovery, and bound queues to control slow consumers.',
            isCorrect: true,
            explanation:
              'This names one valid coordination approach, acknowledges recovery and idempotency, and controls backpressure instead of assuming horizontal scaling happens automatically.',
          },
          {
            id: 'quiz-2-5-q4-d',
            label: 'Switch to regular polling so the service has no persistent connections and never needs shared state.',
            isCorrect: false,
            explanation:
              'Polling can avoid connection state but still needs shared state to return consistent chat history, and it adds delay and request overhead for a low-latency chat feature.',
          },
        ],
        explanation:
          'Persistent connections are tied to instances. Cross-instance delivery needs coordination, and recovery needs sequence ids, replay and backpressure rather than a transport guarantee.',
      },
      {
        id: 'quiz-2-5-q5',
        prompt:
          'Which protocol choice is best justified for a low-latency chat window with typing indicators, read receipts and a separate order-status page that must work on unstable mobile networks?',
        options: [
          {
            id: 'quiz-2-5-q5-a',
            label: 'Use SSE for chat and WebSockets for order status because SSE supports frequent client messages.',
            isCorrect: false,
            explanation:
              'SSE cannot natively send client messages, and WebSockets can be blocked on unstable mobile paths. This reverses the natural fit.',
          },
          {
            id: 'quiz-2-5-q5-b',
            label: 'Use WebSockets for chat with typed bidirectional events, and Long Polling or regular polling for order status where upgrades and streams may be blocked.',
            isCorrect: true,
            explanation:
              'Chat needs both sides to initiate low-latency events; order status is moderate, one-way state where compatibility matters. The answer names an alternative and its trade-off.',
          },
          {
            id: 'quiz-2-5-q5-c',
            label: 'Use WebSockets everywhere because one protocol is simpler and always superior for real-time features.',
            isCorrect: false,
            explanation:
              'A persistent channel adds state and recovery cost. It is not universally superior, especially where infrastructure blocks upgrades.',
          },
          {
            id: 'quiz-2-5-q5-d',
            label: 'Use regular polling for chat because long polling and WebSockets cannot deliver updates faster than a timer.',
            isCorrect: false,
            explanation:
              'Polling is bounded by its interval and wastes requests on unchanged state. Persistent channels can push an update as soon as it occurs.',
          },
        ],
        explanation:
          'Select from direction, frequency and constraints. Chat fits bidirectional WebSockets; order-status pages fit Long Polling or polling when compatibility and unstable networks dominate.',
      },
    ],
  },
  {
    id: 'quiz-2-6',
    title: 'Load Balancing — knowledge check',
    description:
      'Five applied questions on L4 and L7 decisions, distribution algorithms, health handling, reduced capacity and high availability.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-2-6-q1',
        prompt:
          'A web application needs /api/users and /api/orders to reach different service pools, while clients use one public hostname. Which load-balancing choice is best justified?',
        options: [
          {
            id: 'quiz-2-6-q1-a',
            label: 'Use Layer 4 because it reads the HTTP path and can route each request to the correct service.',
            isCorrect: false,
            explanation:
              'A typical Layer 4 balancer uses IP, port and protocol information. It generally cannot read an HTTP path such as /api/users.',
          },
          {
            id: 'quiz-2-6-q1-b',
            label: 'Use Layer 4 because Layer 7 is always slower and cannot handle HTTPS traffic.',
            isCorrect: false,
            explanation:
              'Layer 7 can handle HTTPS when TLS is terminated at the balancer, and it is not automatically too slow. Performance depends on the workload and implementation.',
          },
          {
            id: 'quiz-2-6-q1-c',
            label: 'Use Layer 7, terminate TLS at the balancer, inspect the hostname and path, and route each request to the appropriate service pool.',
            isCorrect: true,
            explanation:
              'Path and hostname routing require application-level information. Layer 7 can inspect HTTP requests after TLS termination and send /api/users and /api/orders to different pools.',
          },
          {
            id: 'quiz-2-6-q1-d',
            label: 'Use IP hashing because affinity is required before a load balancer can inspect HTTP headers.',
            isCorrect: false,
            explanation:
              'IP hashing maps clients to backends but does not provide application awareness. Affinity is a locality choice, not a prerequisite for HTTP inspection.',
          },
        ],
        explanation:
          'Choose the layer from the information the decision needs. Different URL paths require Layer 7 visibility, normally with TLS termination at the balancer.',
      },
      {
        id: 'quiz-2-6-q2',
        prompt:
          'Three short-REST-request backends have 8, 4 and 4 CPU cores with matching memory. Which distribution choice is the most defensible starting point?',
        options: [
          {
            id: 'quiz-2-6-q2-a',
            label: 'Use Weighted Round Robin with roughly 2:1:1 as a starting estimate, then validate and adjust it with latency, CPU and error metrics.',
            isCorrect: true,
            explanation:
              'The larger server has about twice the stated capacity, so a 2:1:1 share (equivalent to 5:3:2 in spirit) is a reasonable hypothesis. CPU and RAM are only starting evidence, so measurement must confirm the weights.',
          },
          {
            id: 'quiz-2-6-q2-b',
            label: 'Use simple Round Robin because equal request counts always produce equal workload.',
            isCorrect: false,
            explanation:
              'Equal counts do not equalize resource use when server capacities or request costs differ. The eight-core server may be underused while the four-core servers struggle.',
          },
          {
            id: 'quiz-2-6-q2-c',
            label: 'Use Weighted Round Robin with 1:1:1 weights because weights should ignore server capacity.',
            isCorrect: false,
            explanation:
              'Equal weights reproduce simple Round Robin and discard the known capacity difference. Weights exist precisely to express intended share differences.',
          },
          {
            id: 'quiz-2-6-q2-d',
            label: 'Use IP hashing because keeping each client on one server guarantees balanced CPU utilization.',
            isCorrect: false,
            explanation:
              'IP hashing provides affinity, not capacity balancing. NAT populations and changing client IPs can make its distribution quite uneven.',
          },
        ],
        explanation:
          'Weighted Round Robin expresses known capacity differences, but CPU and memory alone do not determine perfect weights. Start with an estimate and validate under real traffic.',
      },
      {
        id: 'quiz-2-6-q3',
        prompt:
          'An API has short calls and a few reports that hold connections for minutes. Which statement about Least Connections is accurate?',
        options: [
          {
            id: 'quiz-2-6-q3-a',
            label: 'It measures the CPU and memory usage of every backend and therefore always selects the least busy server.',
            isCorrect: false,
            explanation:
              'Least Connections counts active connections. It does not directly measure CPU, memory, application queues or the cost of a single connection.',
          },
          {
            id: 'quiz-2-6-q3-b',
            label: 'It removes the need for health checks because a backend with zero connections is always healthy.',
            isCorrect: false,
            explanation:
              'A zero connection count may mean a server is broken. Health checks are still needed to keep failed backends out of the pool.',
          },
          {
            id: 'quiz-2-6-q3-c',
            label: 'Round Robin is always better here because it prevents any server from holding more than one long request.',
            isCorrect: false,
            explanation:
              'Round Robin cannot prevent a long request from occupying a server; it simply gives that server the next turn as well. Least Connections usually fits uneven durations better.',
          },
          {
            id: 'quiz-2-6-q3-d',
            label: 'It can adapt to long-running work by preferring backends with fewer active connections, but the count remains only a proxy for real load.',
            isCorrect: true,
            explanation:
              'A backend holding long reports will have a higher connection count and receive fewer new requests. That helps, but idle or cheap connections and downstream bottlenecks can still make the proxy misleading.',
          },
        ],
        explanation:
          'Least Connections reacts to held work better than a fixed rotation, but connection count is a proxy. Combine it with health checks, timeouts and capacity limits.',
      },
      {
        id: 'quiz-2-6-q4',
        prompt:
          'One of four equal backends repeatedly fails readiness probes. What is the most defensible health and failure response?',
        options: [
          {
            id: 'quiz-2-6-q4-a',
            label: 'Remove it after the first failed probe and return it after the first success to keep the pool as large as possible.',
            isCorrect: false,
            explanation:
              'Single-probe changes cause flapping. Failure and recovery thresholds absorb transient errors and prevent premature return.',
          },
          {
            id: 'quiz-2-6-q4-b',
            label: 'Use active readiness probes with failure and recovery thresholds, remove it from new traffic after the threshold, and check that the remaining three have enough capacity.',
            isCorrect: true,
            explanation:
              'Readiness probes reflect ability to serve, thresholds prevent flapping, and capacity review addresses the fact that the survivors now carry a larger share. Ignoring that share can cause cascading overload.',
          },
          {
            id: 'quiz-2-6-q4-c',
            label: 'Use only a liveness endpoint that returns 200 OK while the process runs, because readiness is the same as being alive.',
            isCorrect: false,
            explanation:
              'A process can be alive but unable to serve traffic because startup or dependencies are not ready. Readiness is a distinct question.',
          },
          {
            id: 'quiz-2-6-q4-d',
            label: 'Rely only on passive monitoring and do not configure probes, because real traffic reveals every failure before users are affected.',
            isCorrect: false,
            explanation:
              'Passive monitoring depends on real requests and can let users hit a failing backend first. Active probes provide a proactive baseline.',
          },
        ],
        explanation:
          'Health handling combines readiness semantics, thresholds and removal behavior. Losing a backend also changes capacity for every remaining instance.',
      },
      {
        id: 'quiz-2-6-q5',
        prompt:
          'Which statement describes a defensible resilient load-balancing strategy with redundant load balancers for a growing e-commerce application?',
        options: [
          {
            id: 'quiz-2-6-q5-a',
            label: 'Deploy one carefully configured load balancer because redundancy is only needed for databases.',
            isCorrect: false,
            explanation:
              'The load balancer is on the critical path. If it fails, healthy backends are unreachable, so it needs its own availability design.',
          },
          {
            id: 'quiz-2-6-q5-b',
            label: 'Require sticky sessions for every user and assume this removes the need for capacity planning.',
            isCorrect: false,
            explanation:
              'Sticky sessions add locality but constrain placement and complicate failover. Stateless design is usually easier to scale, and affinity does not create capacity.',
          },
          {
            id: 'quiz-2-6-q5-c',
            label: 'Use redundant load balancers with a reliable traffic entry and failover, readiness checks with thresholds, an algorithm matched to the workload signal, and monitoring of backend and balancer capacity.',
            isCorrect: true,
            explanation:
              'This addresses the full system: balancer availability, backend health, workload-aware selection and observed capacity. It also permits different algorithms for different paths when Layer 7 routing is needed.',
          },
          {
            id: 'quiz-2-6-q5-d',
            label: 'Always choose Layer 7 and Least Connections because they are universally superior to simpler options.',
            isCorrect: false,
            explanation:
              'Layer 7 adds parsing and TLS decisions, and Least Connections uses only one signal. The right choice depends on routing needs, workload and measured trade-offs.',
          },
        ],
        explanation:
          'Resilience requires matching the layer and algorithm to requirements, checking readiness, planning for reduced capacity and making the balancer itself highly available.',
      },
    ],
  },
  {
    id: 'quiz-2-7',
    title: 'Reverse Proxy: Final Assessment',
    description:
      'Five scenario-based questions on proxy roles, request flow, TLS boundaries, API gateways and forwarded-header trust in production architectures.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-2-7-q1',
        prompt:
          'A company routes all employee browsers through one corporate service for outbound filtering and logging. External websites see that service as the connecting client. Which role is this, and what is the key reason?',
        options: [
          {
            id: 'quiz-2-7-q1-a',
            label: 'A reverse proxy, because it hides backend application servers from customers.',
            isCorrect: false,
            explanation:
              'Hiding backends is the reverse-proxy pattern. This scenario is about outbound employee traffic and a destination seeing an intermediary as the client.',
          },
          {
            id: 'quiz-2-7-q1-b',
            label: 'A load balancer, because it distributes requests between external websites.',
            isCorrect: false,
            explanation:
              'A load balancer selects among servers for incoming traffic. Here one configured intermediary represents clients leaving a network.',
          },
          {
            id: 'quiz-2-7-q1-c',
            label: 'A forward proxy, because it is configured on the client side and represents clients to external destinations.',
            isCorrect: true,
            explanation:
              'Forward proxies handle outbound client traffic. The destination sees the proxy address, and the organization controls access policy and logging.',
          },
          {
            id: 'quiz-2-7-q1-d',
            label: 'An API gateway, because it enforces consumer quotas for external websites.',
            isCorrect: false,
            explanation:
              'An API gateway sits in front of APIs for API consumers. It does not describe corporate outbound browsing through a client-configured intermediary.',
          },
        ],
        explanation:
          'The architectural question is which side configures and is represented by the proxy. Corporate outbound traffic through an intermediary is a forward proxy.',
      },
      {
        id: 'quiz-2-7-q2',
        prompt:
          'A client resolves shop.example.com and sends HTTPS to a public address. The intermediary reads the path /api/orders, chooses one healthy instance from an internal Order API pool and returns that instance’s response. Which sequence best describes the request flow?',
        options: [
          {
            id: 'quiz-2-7-q2-a',
            label: 'DNS resolves the public proxy address; the client connects to the proxy; the proxy evaluates routing rules, selects an upstream, forwards over a backend-facing connection and returns the response.',
            isCorrect: true,
            explanation:
              'This captures the two connection legs and the routing decision. The proxy is the public entry point while upstream instances remain internal.',
          },
          {
            id: 'quiz-2-7-q2-b',
            label: 'DNS resolves directly to the chosen Order API instance; the client connects to it; the proxy only records logs after the response.',
            isCorrect: false,
            explanation:
              'A reverse proxy is on the request path, not merely a logger. DNS normally points to the public entry point, and the proxy selects the upstream.',
          },
          {
            id: 'quiz-2-7-q2-c',
            label: 'The client connects to each backend until one responds; the proxy rewrites DNS records after a failure.',
            isCorrect: false,
            explanation:
              'Clients do not probe internal backends in this pattern, and a reverse proxy does not rewrite DNS as its normal request-forwarding mechanism.',
          },
          {
            id: 'quiz-2-7-q2-d',
            label: 'The proxy creates a single end-to-end connection from client to backend and cannot inspect the path at all.',
            isCorrect: false,
            explanation:
              'Client-facing and backend-facing connections are separate. Path-based routing requires the intermediary to see HTTP request information.',
          },
        ],
        explanation:
          'A reverse proxy accepts a public request, makes a routing decision, forwards it over a separate upstream connection and returns the response through the same public entry point.',
      },
      {
        id: 'quiz-2-7-q3',
        prompt:
          'A public API must keep application payloads unreadable by the edge intermediary, but the team also wants path-based routing at that intermediary. Which design statement is accurate?',
        options: [
          {
            id: 'quiz-2-7-q3-a',
            label: 'Terminate TLS at the proxy and forward plaintext HTTP. This keeps the whole path encrypted because the client used HTTPS.',
            isCorrect: false,
            explanation:
              'Termination decrypts at the proxy, and plaintext HTTP to the backend is exposed on that segment. Client-side HTTPS does not encrypt the whole path.',
          },
          {
            id: 'quiz-2-7-q3-b',
            label: 'Use TLS passthrough and expect the proxy to route on the full HTTP path because it still terminates TLS.',
            isCorrect: false,
            explanation:
              'Passthrough means the proxy does not decrypt the application payload, so it generally cannot read the HTTP path for routing.',
          },
          {
            id: 'quiz-2-7-q3-c',
            label: 'Terminate TLS at the proxy and stop encrypting internal traffic; certificate management is centralized so no further decision is needed.',
            isCorrect: false,
            explanation:
              'Centralized certificates are useful, but the proxy-to-backend segment still needs an explicit security decision based on network trust.',
          },
          {
            id: 'quiz-2-7-q3-d',
            label: 'TLS passthrough protects payload visibility at the proxy but limits HTTP-aware routing; path routing generally requires termination or another point that can inspect HTTP.',
            isCorrect: true,
            explanation:
              'The trade-off is visibility versus encryption boundary. A design must state where TLS terminates and which components can read HTTP-level information.',
          },
        ],
        explanation:
          'Describe every network segment. Termination enables content-aware routing but exposes plaintext at the proxy; passthrough preserves payload confidentiality but limits what the proxy can inspect.',
      },
      {
        id: 'quiz-2-7-q4',
        prompt:
          'A public API has several client applications, per-consumer quotas, token validation, version routing and API-specific metrics. Which choice best justifies the architecture?',
        options: [
          {
            id: 'quiz-2-7-q4-a',
            label: 'A basic reverse proxy alone, because proxy_pass automatically implements consumer quotas and token validation.',
            isCorrect: false,
            explanation:
              'Basic forwarding does not automatically deliver API consumer policies. Those responsibilities require explicit configuration or a dedicated component.',
          },
          {
            id: 'quiz-2-7-q4-b',
            label: 'An API gateway, because the stated consumer policies and observability are API-oriented responsibilities beyond basic forwarding, though it still uses reverse-proxy behavior.',
            isCorrect: true,
            explanation:
              'The requirements justify gateway responsibilities. A gateway forwards requests but adds API-aware policy, quotas and observability.',
          },
          {
            id: 'quiz-2-7-q4-c',
            label: 'A forward proxy, because it can validate tokens for external API consumers before they reach the platform.',
            isCorrect: false,
            explanation:
              'A forward proxy represents outbound clients. It is not the inbound, operator-controlled entry point for a public API platform.',
          },
          {
            id: 'quiz-2-7-q4-d',
            label: 'Remove all backend services and let the gateway implement business logic so policies and data stay together.',
            isCorrect: false,
            explanation:
              'A gateway should not replace business services. Authorization decisions can be integrated, but domain logic remains in backend services.',
          },
        ],
        explanation:
          'Name responsibilities rather than product labels. Consumer quotas, token validation, version routing and API metrics are strong reasons to justify a gateway.',
      },
      {
        id: 'quiz-2-7-q5',
        prompt:
          'An ASP.NET Core API sits behind a trusted Nginx edge and an API gateway. The team needs correct client IP for rate limits and the original HTTPS scheme for redirects. Which approach is defensible?',
        options: [
          {
            id: 'quiz-2-7-q5-a',
            label: 'Trust X-Forwarded-For from every request and clear all forwarded-header restrictions so ASP.NET Core always sees the client.',
            isCorrect: false,
            explanation:
              'Accepting headers from arbitrary clients permits IP and scheme spoofing, which can bypass rate limits or distort redirects.',
          },
          {
            id: 'quiz-2-7-q5-b',
            label: 'Let the browser set X-Forwarded-Proto directly and disable URL generation so scheme handling is irrelevant.',
            isCorrect: false,
            explanation:
              'Browsers and arbitrary clients cannot be trusted to describe the original scheme. Disabling URL generation avoids the problem rather than solving it.',
          },
          {
            id: 'quiz-2-7-q5-c',
            label: 'Have known proxies append forwarded headers, restrict ASP.NET Core with KnownProxies or KnownNetworks, and run UseForwardedHeaders before middleware that depends on scheme or client IP.',
            isCorrect: true,
            explanation:
              'This preserves original information only from trusted hops. Middleware ordering matters because redirects, URL generation, authentication and IP policies consume the processed values.',
          },
          {
            id: 'quiz-2-7-q5-d',
            label: 'Trust the proxy address as the client address and ignore scheme information; multi-hop chains do not change application behavior.',
            isCorrect: false,
            explanation:
              'Ignoring forwarded information breaks rate limiting, logs and redirect generation. Multi-hop chains need a documented and deliberately trusted handling strategy.',
          },
        ],
        explanation:
          'Forwarded headers are useful only inside a clear trust boundary. Configure trusted proxies or networks, preserve chains deliberately and process headers before dependent middleware.',
      },
    ],
  },
  {
    id: 'quiz-3-1',
    title: 'Database Fundamentals: Final Assessment',
    description:
      'Five scenario-based questions on database and DBMS fundamentals, relational keys and relationships, non-relational models, architectural trade-offs and requirements-driven selection.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-3-1-q1',
        prompt:
          'A developer says, “PostgreSQL is our database, so the tables it stores are our data model.” Which distinction is accurate?',
        options: [
          {
            id: 'quiz-3-1-q1-a',
            label: 'The database is the DBMS software, while the data model is the physical disk where records are stored.',
            isCorrect: false,
            explanation:
              'The DBMS is the software that manages data; the physical storage device is not the data model.',
          },
          {
            id: 'quiz-3-1-q1-b',
            label: 'The database is the organized collection of persisted data, the DBMS is the software that manages it, and the data model is the conceptual structure of the data.',
            isCorrect: true,
            explanation:
              'These are three separate ideas. The collection, the managing software and the conceptual shape should not be conflated.',
          },
          {
            id: 'quiz-3-1-q1-c',
            label: 'The data model is the query language, so a system without SQL does not have a data model.',
            isCorrect: false,
            explanation:
              'A query language is not the same as a data model. Non-relational systems have models even when they do not use SQL.',
          },
          {
            id: 'quiz-3-1-q1-d',
            label: 'Products such as PostgreSQL and MongoDB are data models, while the word database only refers to a server process.',
            isCorrect: false,
            explanation:
              'Those products are DBMS examples that illustrate categories. A database is the organized data itself.',
          },
        ],
        explanation:
          'Precise vocabulary matters: database, DBMS and data model describe the stored collection, the managing software and the conceptual structure respectively.',
      },
      {
        id: 'quiz-3-1-q2',
        prompt:
          'An Orders table has OrderID as its identifier and stores CustomerID, which matches CustomerID in the Customers table. What does this design describe?',
        options: [
          {
            id: 'quiz-3-1-q2-a',
            label: 'CustomerID in Orders is another primary key because every order must contain a customer.',
            isCorrect: false,
            explanation:
              'A primary key identifies rows in its own table. CustomerID identifies a customer row, not the order row.',
          },
          {
            id: 'quiz-3-1-q2-b',
            label: 'The two tables cannot represent a many-to-many relationship without merging all records into one table.',
            isCorrect: false,
            explanation:
              'Many-to-many relationships can be represented with a junction table such as OrderItems containing two foreign keys.',
          },
          {
            id: 'quiz-3-1-q2-c',
            label: 'CustomerID in Orders is a foreign key referencing the Customers primary key, and it can help enforce referential integrity.',
            isCorrect: true,
            explanation:
              'The foreign key stores the referenced primary key and expresses the relationship between an order and its customer.',
          },
          {
            id: 'quiz-3-1-q2-d',
            label: 'OrderID is a foreign key because it points to an order, and CustomerID is a natural key because it is generated automatically.',
            isCorrect: false,
            explanation:
              'OrderID is the primary key of Orders. A generated identifier is a surrogate key, not a natural key.',
          },
        ],
        explanation:
          'Primary keys identify rows, foreign keys connect rows across tables, and relationship cardinality determines whether a junction table is needed.',
      },
      {
        id: 'quiz-3-1-q3',
        prompt:
          'Which statement correctly matches non-relational data models to how they represent and query data?',
        options: [
          {
            id: 'quiz-3-1-q3-a',
            label: 'Document stores keep JSON-like aggregates, key-value stores retrieve by key, wide-column stores use rows and flexible column families, and graph stores traverse nodes and edges.',
            isCorrect: true,
            explanation:
              'This captures the core representation and access pattern of each introduced model without claiming one is universally better.',
          },
          {
            id: 'quiz-3-1-q3-b',
            label: 'All non-relational databases use the same flexible table structure and differ only in product name.',
            isCorrect: false,
            explanation:
              'Non-relational databases are a diverse family with model-specific structures and query approaches.',
          },
          {
            id: 'quiz-3-1-q3-c',
            label: 'A graph store has no structure because relationships replace the need for nodes, fields and constraints.',
            isCorrect: false,
            explanation:
              'Graph stores still have structure: nodes, edges and their types or properties are deliberate modeling choices.',
          },
          {
            id: 'quiz-3-1-q3-d',
            label: 'Key-value stores are designed for multi-table joins, while document stores cannot retrieve a document by identifier.',
            isCorrect: false,
            explanation:
              'Key-value stores focus on lookup by key, and document stores commonly retrieve documents by identifier.',
          },
        ],
        explanation:
          'Model choice follows representation and access pattern: aggregate reads, key lookup, distributed wide-row access or relationship traversal.',
      },
      {
        id: 'quiz-3-1-q4',
        prompt:
          'A team says, “NoSQL is always faster, and relational databases cannot scale horizontally.” Which response best reflects architectural trade-offs?',
        options: [
          {
            id: 'quiz-3-1-q4-a',
            label: 'Agree, because non-relational databases do not enforce schemas and therefore skip all correctness work.',
            isCorrect: false,
            explanation:
              'Flexible storage does not remove validation or correctness work; it changes where that work is expressed.',
          },
          {
            id: 'quiz-3-1-q4-b',
            label: 'Agree, because joins always make relational databases slower than every document or key-value store.',
            isCorrect: false,
            explanation:
              'Join cost depends on data, query design and workload. Document reads can also become costly when data must be assembled or duplicated.',
          },
          {
            id: 'quiz-3-1-q4-c',
            label: 'Disagree only about scaling, but accept that SQL databases cannot store JSON or semi-structured data.',
            isCorrect: false,
            explanation:
              'Modern relational databases can store JSON and other semi-structured values as well as scale horizontally with the right design.',
          },
          {
            id: 'quiz-3-1-q4-d',
            label: 'Disagree: speed and scalability depend on workload, data model, consistency choices and operations; relational systems can scale, and NoSQL is not automatically faster.',
            isCorrect: true,
            explanation:
              'Absolute claims are unreliable. Each family has strengths and costs that must be evaluated against a concrete workload.',
          },
        ],
        explanation:
          'Avoid absolute performance claims. Compare data shape, access patterns, consistency and operational reality instead.',
      },
      {
        id: 'quiz-3-1-q5',
        prompt:
          'An e-commerce platform needs reliable orders and payments, highly variable product attributes, fast session lookup and rapidly growing browsing activity. Which initial reasoning is most defensible?',
        options: [
          {
            id: 'quiz-3-1-q5-a',
            label: 'Use a key-value store for everything because key lookup is faster than every other access pattern.',
            isCorrect: false,
            explanation:
              'A key-value model cannot conveniently express the relationships and multi-record correctness needed by orders and payments.',
          },
          {
            id: 'quiz-3-1-q5-b',
            label: 'Use a graph database because every platform with user activity requires relationship traversal as its primary query.',
            isCorrect: false,
            explanation:
              'Activity data alone does not make graph traversal the dominant pattern. The model must be justified by actual queries.',
          },
          {
            id: 'quiz-3-1-q5-c',
            label: 'Start with a relational store for orders and payments; consider a document model for variable catalog aggregates and a key-value store for sessions, while treating a simpler relational-plus-cache design as a valid alternative until needs are proven.',
            isCorrect: true,
            explanation:
              'This reasoning starts from requirements, preserves correctness where it matters and adds models only for distinct workloads with named alternatives.',
          },
          {
            id: 'quiz-3-1-q5-d',
            label: 'Adopt as many database technologies as possible so the architecture demonstrates polyglot persistence.',
            isCorrect: false,
            explanation:
              'Technology diversity is a cost, not a goal. Every extra store needs operational ownership and a concrete workload reason.',
          },
        ],
        explanation:
          'A defensible architecture matches each workload to a model, names trade-offs and avoids adding databases merely to demonstrate variety.',
      },
    ],
  },
  {
    id: 'quiz-3-2',
    title: 'SQL Databases: Final Assessment',
    description:
      'Apply schema design reasoning to keys, relationships, constraints, anomalies, functional dependencies and normal forms.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-3-2-q1',
        prompt:
          'An orders table must support several products per order, retain the unit price charged at purchase time and prevent the same product from being added twice to one order. Which schema choice satisfies these requirements?',
        options: [
          {
            id: 'quiz-3-2-q1-a',
            label: 'Keep ProductIDs and ProductNames as semicolon-separated columns in Orders, with one row per order.',
            isCorrect: false,
            explanation:
              'A list inside one column is a repeating group, cannot be constrained by a foreign key and makes duplicate detection and joins unreliable.',
          },
          {
            id: 'quiz-3-2-q1-b',
            label: 'Create OrderItems with only ItemID, OrderID, ProductID and Quantity, relying on the surrogate key for uniqueness.',
            isCorrect: false,
            explanation:
              'A surrogate key identifies rows but does not stop the same product from appearing twice on one order. A UNIQUE rule on (OrderID, ProductID) is still needed.',
          },
          {
            id: 'quiz-3-2-q1-c',
            label: 'Create OrderItems with primary key (OrderID, ProductID), foreign keys to Orders and Products, Quantity and a UnitPrice column copied from the product at purchase time.',
            isCorrect: true,
            explanation:
              'The composite key allows many products per order while preventing duplicates, the foreign keys enforce valid references, and UnitPrice preserves the historical charged price.',
          },
          {
            id: 'quiz-3-2-q1-d',
            label: 'Store customer name, product name and current product price directly in Orders and omit Products and OrderItems.',
            isCorrect: false,
            explanation:
              'This repeats customer and product facts, loses stable product identity and uses the current price rather than the historical charged price.',
          },
        ],
        explanation:
          'A one-to-many relationship from Orders to OrderItems plus a uniqueness rule on the product pair models the workflow correctly. Historical price belongs on the order line.',
      },
      {
        id: 'quiz-3-2-q2',
        prompt:
          'A university allows team teaching: one course can have many instructors and one instructor can teach many courses. Instructor profile details are optional and rarely read. Which modeling choice is defensible?',
        options: [
          {
            id: 'quiz-3-2-q2-a',
            label: 'Put InstructorID in Courses because one instructor can teach many courses.',
            isCorrect: false,
            explanation:
              'This models only one instructor per course and contradicts the team-teaching rule. The many-to-many direction is not represented.',
          },
          {
            id: 'quiz-3-2-q2-b',
            label: 'Store InstructorIDs as a comma-separated list in Courses.InstructorIDs.',
            isCorrect: false,
            explanation:
              'A list in one column cannot be checked by a foreign key and makes queries and updates for one instructor awkward.',
          },
          {
            id: 'quiz-3-2-q2-c',
            label: 'Use CourseInstructors(CourseID, InstructorID) with a composite key and foreign keys, and keep optional profile details in InstructorProfiles keyed by a unique foreign key to Instructors.',
            isCorrect: true,
            explanation:
              'The junction table represents team teaching correctly, while a unique foreign key enforces the optional one-to-one profile relationship.',
          },
          {
            id: 'quiz-3-2-q2-d',
            label: 'Put CourseID in Instructors and add all profile columns to every course row.',
            isCorrect: false,
            explanation:
              'This reverses the many-to-many relationship and repeats instructor and profile details in course rows, creating update anomalies.',
          },
        ],
        explanation:
          'Many-to-many needs a junction table. Optional profile data can earn a separate table when it has a different access pattern, lifecycle or security boundary.',
      },
      {
        id: 'quiz-3-2-q3',
        prompt:
          'An order must reference an existing customer, have a non-negative total, start with status Pending when omitted and preserve order history when a customer record is removed. Which constraint set fits?',
        options: [
          {
            id: 'quiz-3-2-q3-a',
            label: 'CustomerID NULL with ON DELETE CASCADE, CHECK (Total >= 0), UNIQUE (Email) and DEFAULT status Pending.',
            isCorrect: false,
            explanation:
              'A null customer breaks required ownership, and cascade can delete order history that must be preserved.',
          },
          {
            id: 'quiz-3-2-q3-b',
            label: 'CustomerID NOT NULL with a foreign key using ON DELETE NO ACTION, CHECK (Total >= 0), UNIQUE (Email), DEFAULT status Pending and CHECK on allowed statuses.',
            isCorrect: true,
            explanation:
              'The foreign key requires a real customer, NO ACTION protects history, the check protects the amount, UNIQUE protects email identity and the default plus check control status.',
          },
          {
            id: 'quiz-3-2-q3-c',
            label: 'Leave validation entirely to the application so the database stays flexible.',
            isCorrect: false,
            explanation:
              'Application validation helps users but cannot protect the data from imports, scripts or other services that write directly.',
          },
          {
            id: 'quiz-3-2-q3-d',
            label: 'Use FLOAT for Total, allow any status text and add a UNIQUE rule on Orders.OrderDate.',
            isCorrect: false,
            explanation:
              'FLOAT is unsuitable for exact money, unconstrained status permits invalid values and order dates are not a unique business identifier.',
          },
        ],
        explanation:
          'Constraints belong in the database for invariants that every writer must obey. Delete behavior must reflect business history rather than convenience.',
      },
      {
        id: 'quiz-3-2-q4',
        prompt:
          'A table Enrollment(StudentID, StudentName, CourseID, CourseTitle, Grade) has composite key (StudentID, CourseID). Which dependency and decomposition analysis is correct?',
        options: [
          {
            id: 'quiz-3-2-q4-a',
            label: 'Every non-key attribute depends on the whole key, so no decomposition is needed.',
            isCorrect: false,
            explanation:
              'StudentName depends on StudentID alone and CourseTitle on CourseID alone. These are partial dependencies, so the table is not in 2NF.',
          },
          {
            id: 'quiz-3-2-q4-b',
            label: 'StudentID determines StudentName and CourseID determines CourseTitle, both partially; (StudentID, CourseID) determines Grade fully. Split into Students, Courses and Enrollments.',
            isCorrect: true,
            explanation:
              'This identifies full and partial dependencies from business rules and moves each fact to the entity that owns it.',
          },
          {
            id: 'quiz-3-2-q4-c',
            label: 'Grade determines StudentID and CourseID because grades are unique in the sample data.',
            isCorrect: false,
            explanation:
              'Functional dependencies come from business rules, not observed sample values. Many students can share the same grade.',
          },
          {
            id: 'quiz-3-2-q4-d',
            label: 'The main violation is that Grade is transitively dependent on StudentName.',
            isCorrect: false,
            explanation:
              'Grade needs the whole enrollment key. The clear violations here are partial dependencies on StudentID and CourseID.',
          },
        ],
        explanation:
          'Partial dependencies on part of a composite key are resolved in 2NF by separating student, course and enrollment facts.',
      },
      {
        id: 'quiz-3-2-q5',
        prompt:
          'A table OrderSnapshot has OrderID, CustomerID, CustomerCity, ProductIDs containing several IDs, ProductNames and Quantity. Which normalization sequence is correct?',
        options: [
          {
            id: 'quiz-3-2-q5-a',
            label: 'It is already in 3NF because every column is a single string or number.',
            isCorrect: false,
            explanation:
              'A column containing several product IDs is a repeating group, so the table is not even in 1NF.',
          },
          {
            id: 'quiz-3-2-q5-b',
            label: 'Move CustomerCity into Customers to fix 1NF, then remove ProductIDs to fix 3NF.',
            isCorrect: false,
            explanation:
              'The order of the steps is reversed. Repeating groups are a 1NF issue; the transitive dependency through CustomerID is a 3NF issue.',
          },
          {
            id: 'quiz-3-2-q5-c',
            label: 'Create one order-line row per product for 1NF, separate facts that depend on only part of a composite key for 2NF, and move CustomerCity to Customers because OrderID leads to CustomerID then CustomerCity for 3NF.',
            isCorrect: true,
            explanation:
              'This applies each normal form to the correct defect and leaves Orders with CustomerID as a foreign key instead of repeated customer facts.',
          },
          {
            id: 'quiz-3-2-q5-d',
            label: 'Keep the snapshot and add more copies of CustomerCity in each order line so reporting never needs a join.',
            isCorrect: false,
            explanation:
              'That is unmanaged denormalization: it multiplies the same current fact and creates update anomalies without a measured reason or consistency owner.',
          },
        ],
        explanation:
          'Normalization follows a sequence: atomic rows, full-key dependencies, then no transitive dependencies among non-key attributes.',
      },
    ],
  },
  {
    id: 'quiz-3-3',
    title: 'Database Performance: Final Assessment',
    description:
      'Apply indexing, execution-plan, SARGability and measurement reasoning to realistic database performance problems.',
    passThreshold: 0.8,
    standard: 'final',
    questions: [
      {
        id: 'quiz-3-3-q1',
        prompt:
          'An orders search is slow and the team is considering a new index. Which statement best describes the likely trade-off?',
        options: [
          {
            id: 'quiz-3-3-q1-a',
            label: 'Indexes make every query faster, so add one to every filtered column.',
            isCorrect: false,
            explanation:
              'Indexes help only when a query can use them effectively. Many indexes add storage and write maintenance without guaranteeing faster reads.',
          },
          {
            id: 'quiz-3-3-q1-b',
            label: 'A targeted index can improve selective reads but adds storage and extra work on writes.',
            isCorrect: true,
            explanation:
              'This captures the core read-versus-write trade-off and avoids claiming a universal improvement.',
          },
          {
            id: 'quiz-3-3-q1-c',
            label: 'An index removes the need to inspect execution plans because access is always direct.',
            isCorrect: false,
            explanation:
              'Optimizers may still scan, perform lookups or change plans with different parameters. Plans remain necessary.',
          },
          {
            id: 'quiz-3-3-q1-d',
            label: 'Indexes only affect reads, so write performance is unchanged.',
            isCorrect: false,
            explanation:
              'Inserts, updates and deletes must maintain every index, which is write amplification.',
          },
        ],
        explanation:
          'Index decisions should connect a measured read problem with the storage and write cost of the chosen access path.',
      },
      {
        id: 'quiz-3-3-q2',
        prompt:
          'A common report filters with CustomerId = @CustomerId AND Status = @Status and orders by CreatedAt. Which composite index key order is most defensible as a starting hypothesis?',
        options: [
          {
            id: 'quiz-3-3-q2-a',
            label: '(CreatedAt, Status, CustomerId), because the sort column should always lead.',
            isCorrect: false,
            explanation:
              'Putting CreatedAt first makes it harder to seek directly on the equality filters; the sort should be considered with the filters, not in isolation.',
          },
          {
            id: 'quiz-3-3-q2-b',
            label: '(Status, CustomerId, CreatedAt), because Status is always more selective.',
            isCorrect: false,
            explanation:
              'Selectivity is not a universal property. It depends on parameter values and data distribution, and the query starts with CustomerId.',
          },
          {
            id: 'quiz-3-3-q2-c',
            label: '(CustomerId, CreatedAt, Status), because date ranges always come before equality columns.',
            isCorrect: false,
            explanation:
              'A range on CreatedAt before equality on Status can limit how effectively later keys narrow the result. This order needs evidence.',
          },
          {
            id: 'quiz-3-3-q2-d',
            label: '(CustomerId, Status, CreatedAt), because equality predicates can use the leading keys and CreatedAt can support ordering or a range.',
            isCorrect: true,
            explanation:
              'This is a reasonable starting hypothesis: equality on leading keys followed by an ordered date column. It must still be tested with real plans and parameters.',
          },
        ],
        explanation:
          'Composite order should reflect equality, range and ordering patterns plus actual data distribution, not a blanket rule.',
      },
      {
        id: 'quiz-3-3-q3',
        prompt:
          'An actual execution plan shows an Index Seek followed by many Key Lookups and a large difference between estimated and actual rows. What is the best interpretation?',
        options: [
          {
            id: 'quiz-3-3-q3-a',
            label: 'The Seek proves the plan is optimal and no further work is needed.',
            isCorrect: false,
            explanation:
              'A Seek can still be expensive when it feeds many lookups or is based on misleading estimates.',
          },
          {
            id: 'quiz-3-3-q3-b',
            label: 'The lookups may be costly and the row mismatch suggests statistics or parameter estimates need investigation.',
            isCorrect: true,
            explanation:
              'This identifies both possible costs and the diagnostic value of comparing estimated and actual rows.',
          },
          {
            id: 'quiz-3-3-q3-c',
            label: 'The plan should be rejected because Key Lookups are never acceptable.',
            isCorrect: false,
            explanation:
              'A few lookups can be perfectly reasonable. The number of rows and the measured cost determine whether they matter.',
          },
          {
            id: 'quiz-3-3-q3-d',
            label: 'The cost percentage gives exact milliseconds, so the operator with the highest percentage is always the bottleneck.',
            isCorrect: false,
            explanation:
              'Plan cost percentages are relative estimates, not elapsed-time measurements.',
          },
        ],
        explanation:
          'Read plans as data flow: access path, lookups, joins, sorts and estimate quality together explain performance.',
      },
      {
        id: 'quiz-3-3-q4',
        prompt:
          'Which date predicate is most likely to preserve an efficient index seek on CreatedAt in SQL Server, assuming a suitable index exists?',
        options: [
          {
            id: 'quiz-3-3-q4-a',
            label: 'WHERE CreatedAt >= @FromDate AND CreatedAt < @ToDate',
            isCorrect: true,
            explanation:
              'The indexed column is preserved and the half-open range is correct for DATETIME2 values.',
          },
          {
            id: 'quiz-3-3-q4-b',
            label: 'WHERE YEAR(CreatedAt) = @Year',
            isCorrect: false,
            explanation:
              'Applying YEAR to the column can prevent a clean seek over the underlying date range.',
          },
          {
            id: 'quiz-3-3-q4-c',
            label: 'WHERE CAST(CreatedAt AS DATE) = @Date',
            isCorrect: false,
            explanation:
              'Casting the indexed column changes the expression and can block a direct seek, even though the business filter may look simple.',
          },
          {
            id: 'quiz-3-3-q4-d',
            label: 'WHERE CONVERT(NVARCHAR(30), CreatedAt) LIKE @Prefix',
            isCorrect: false,
            explanation:
              'Converting the column to text and using a pattern is unlikely to support an efficient date range seek.',
          },
        ],
        explanation:
          'SARGable predicates keep the indexed column bare. Apply transformations to parameters rather than stored columns when possible.',
      },
      {
        id: 'quiz-3-3-q5',
        prompt:
          'A team changes three indexes and two query rewrites at once; the endpoint becomes faster. What is the main problem with this approach?',
        options: [
          {
            id: 'quiz-3-3-q5-a',
            label: 'Multiple changes always make plans worse in SQL Server.',
            isCorrect: false,
            explanation:
              'Multiple changes can work, but the issue is attribution: you cannot tell which change caused the improvement.',
          },
          {
            id: 'quiz-3-3-q5-b',
            label: 'Execution plans cannot be compared after any change.',
            isCorrect: false,
            explanation:
              'Plans can be compared; using one representative plan and repeated measurements is standard practice.',
          },
          {
            id: 'quiz-3-3-q5-c',
            label: 'Without a baseline and one-change-at-a-time testing, the team cannot explain why performance changed or avoid regressions.',
            isCorrect: true,
            explanation:
              'A measurement-driven workflow isolates hypotheses, validates correctness and produces a result that can be defended and repeated.',
          },
          {
            id: 'quiz-3-3-q5-d',
            label: 'Queries with joins cannot be optimized without forcing a join algorithm.',
            isCorrect: false,
            explanation:
              'Forcing joins is rarely the right first step. Better access paths, estimates and query shape are usually explored first.',
          },
        ],
        explanation:
          'Reliable optimization is an experiment: baseline, hypothesis, targeted change, repeat measurement and validation.',
      },
    ],
  },
]
