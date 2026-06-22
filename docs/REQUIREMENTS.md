# Requirements

## Functional Requirements

### **Phase 1: Access and Configuration**

**FR1.1: Registration and Base Authentication**:

The system must allow citizens (Normal Users) to create an account, sign in, and recover their credentials using an email address and password.

**FR1.2: Role Management and Privilege Elevation**:

The system must provide an Administrator-only interface (Jurisprudence Authority) that allows modifying the role of any Normal User, granting the privileges and access of the Judge role or revoking them as needed.

### **Phase 2: Filing the Lawsuit**

**FR2.1: AI-Assisted Lawsuit Drafting**:

The system must provide Normal Users with a template-based lawsuit creation module. It must integrate an Artificial Intelligence engine that takes the user's context and generates an editable preliminary document, structured under a standard legal format.

**FR2.2: Identification of Involved Parties**:

During lawsuit creation, the system must mandatorily require the plaintiff to enter the contact details (email address or unique system identifier, if applicable) of the defendant. This ensures that subsequent notifications can be delivered.

### **Phase 3: Processing and Distribution**

**FR3: Case File Generation and Traceability**:

When a lawsuit is submitted, the system must compile a unique digital case file. This file must sequentially and centrally store the initial lawsuit, attached documents, sent notifications, and the status change history.

**FR4: Intelligent Case Assignment**:

The system must allow the Administrator to view newly submitted lawsuits and use an Artificial Intelligence algorithm to suggest or execute the automatic assignment to a Judge. The engine evaluates variables such as the judge's current workload, their resolution history, and their legal area of specialty.

### **Phase 4: Tracking and Cross-Cutting Communication**

**FR5: Multi-Channel Notification Engine**:

The system must dispatch automated alerts (via email and in-app panel notifications) to both the plaintiff and the defendant. These alerts are triggered in real time whenever the case file changes status or the judge issues an official document.

### **Phase 5: Judicial Review and Analysis**

**FR7: Preliminary Lawsuit Review (Restored from analysis)**:

The system must provide the assigned Judge with a work view to evaluate the newly submitted lawsuit, allowing them to change the case file status to "Admitted", "Conditioned" (requires corrections from the plaintiff), or "Rejected", triggering the corresponding notifications.

**FR6: Document Analysis and Semantic Search**:

The system must integrate an advanced AI-assisted search tool inside the Judge's case file viewer. When a query is entered, the system must return the exact page, highlight the relevant paragraph, and generate a synthesis of the information found to speed up the reading of lengthy documents.

### **Phase 6: Resolution and Closure**

**FR8: Resolution Issuance and Case Closure**:

The system must enable a text editor for the Judge to draft, upload, and issue the final verdict document. Upon confirming the action, the system must attach the resolution to the case file, change the overall status to "Closed", and lock further modifications on the base documents.

**FR9: Analytics and Statistical Reports**:

The system must process the metadata of closed case files to feed a control panel (Dashboard) accessible to Judges and Administrators. This module must generate reports on the volume of processed lawsuits, average resolution times, and ruling distribution (favorable/unfavorable).

---

## **Non-Functional Requirements**

**NFR1: Information Confidentiality (Security)**:

All information managed by the system (personal data, lawsuit content, case files, and resolutions) must be strictly protected. The system must ensure data encryption both in transit (via TLS/HTTPS protocols) and at rest (e.g. AES-256 in the database). Only the users involved in a case and authorized judicial staff must have read access to such documents.

**NFR2: Robust Identification and Authentication (Security)**:

Access to the system must be protected by secure authentication mechanisms. User passwords must be stored using one-way hashing algorithms (such as bcrypt or Argon2). For users with critical roles (Judges and Administrators), the system must enforce complex password policies to prevent unauthorized access.

**NFR3: Ease of Use (Usability)**:

The user interface (UI) must be intuitive and oriented toward citizens without advanced legal or technical training. The design must minimize the learning curve, allowing AI-assisted lawsuit drafting (FR2) and case tracking to be performed with the fewest possible clicks, maintaining clear navigation and constant visual feedback.

**NFR4: Assistance for Plaintiffs and Authorities (Support and Accessibility)**:

The system must provide integrated guidance mechanisms (tooltips, interactive guides, or a help module) to guide normal users during the lawsuit registration process. It must also offer clear internal documentation so that Judges understand how to use the AI tools for search (FR6) and case resolution.

**NFR5: Deployment Across Different Devices (Compatibility and Portability)**:

The frontend architecture must be fully responsive (Responsive Web Design). The system must operate optimally and maintain visual integrity on both desktop computers (Windows, macOS, Linux) and mobile devices and tablets, through standard modern web browsers (Chrome, Safari, Firefox, Edge).

**NFR6: Response Times (Performance)**:

The system must guarantee smooth performance so as not to interrupt the judicial workflow. Standard database queries (loading case files, signing in) must resolve in under 2 seconds. For operations that require intensive processing (AI text generation or semantic search), the system must display a loading indicator and return the result within a maximum acceptable time (e.g. 5 to 8 seconds).
