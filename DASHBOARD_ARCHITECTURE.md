# OpenBench — Dashboard Architecture & Role-Based Access Control

> **Document Version**: 1.0.0  
> **Status**: APPROVED & IMPLEMENTED  
> **Scope**: Multi-Tenant Route Hierarchy, Navigation Separation, RBAC & IDOR Enforcement

---

## 1. Architectural Philosophy: Strict Role Isolation

In OpenBench, different user roles have completely different operational responsibilities, legal obligations, and data views. **Dashboards and functionalities are never mixed into the same view or navigation.**

### The Core Roles:
1. **Public / Unauthenticated Visitor**: Prospective clients and freelance applicants evaluating the collective.
2. **Founder Admin (`ADMIN`)**: The 2-person ops team (Alex & Priya) managing the CRM, financial scoping, pod allocation, deliverable QA, and bank payouts.
3. **Bench Specialist (`TALENT`)**: Vetted contractors reviewing open-book project invitations, e-signing SOWs, uploading milestone deliverables, and downloading tax receipts.
4. **Project Client (`CLIENT`)**: Enterprise clients submitting briefs, tracking milestone escrow deposits (50/30/20), and reviewing founder-QA-approved deliverables.

---

## 2. Role-to-Dashboard Matrix

| User Role | Entry Point Route | Navigation Type | Permitted Capabilities | Prohibited Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Public Visitor** | `/` | Top Navbar + Footer | Explore verticals, interactive budget calculator, submit intake brief, apply for bench. | Cannot access any internal project, milestone, or payout data. |
| **Founder Admin** | `/admin/dashboard` | Dedicated Ops Sidebar | Full talent CRM, vetting notes, 50/30/20 scoping builder, 100% pod assembler, QA Gate, payout disbursement, CSV export. | Strict founder-only access; protected by `requireRole('ADMIN')`. |
| **Bench Talent** | `/talent/dashboard` | Dedicated Talent Sidebar | Toggle 72h availability, open-book SOW e-sign, deliverable upload for QA, payout ledger, tax receipts. | Cannot view client contact billing info, unapproved candidate notes, or other projects. |
| **Client** | `/client/dashboard` | Dedicated Client Sidebar | Project progress, milestone checkout (Stripe/Razorpay), deliverable review, revision request (2-round cap), change orders. | Cannot view contractor internal payouts, platform margins, or unapproved QA submissions. |

---

## 3. Navigation & Layout Separation Strategy

### 3.1 Public Layout (`client/src/components/layout/Navbar.tsx` & `Footer.tsx`)
- Minimalist, high-trust editorial navigation.
- Prominent dual CTAs: **"Start a Project"** (linking to `/start-project`) and **"Join the Talent Bench"** (linking to `/join`).
- Includes direct link to `/login` with clean role-aware redirection.

### 3.2 Authenticated Portal Layout (`client/src/components/layout/PortalLayout.tsx`)
A unified, responsive container that dynamically mounts the **role-specific sidebar**:

```typescript
// Role-specific sidebar item routing
const getNavItems = (role: UserRole) => {
  switch (role) {
    case 'ADMIN':
      return [
        { label: 'Ops Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Talent CRM', href: '/admin/talent', icon: Users },
        { label: 'Projects & Pipeline', href: '/admin/projects', icon: FolderGit2 },
      ];
    case 'TALENT':
      return [
        { label: 'Bench Dashboard', href: '/talent/dashboard', icon: LayoutDashboard },
        { label: 'Payouts & Ledger', href: '/talent/payouts', icon: DollarSign },
        { label: 'Profile & Tax/Banking', href: '/talent/profile', icon: UserCircle },
      ];
    case 'CLIENT':
      return [
        { label: 'Projects Overview', href: '/client/dashboard', icon: LayoutDashboard },
        { label: 'New Project Brief', href: '/client/projects/new', icon: PlusCircle },
      ];
  }
};
```

### 3.3 Founder Contact Card
Clients and talent always have a direct line to the two founders. Embedded in the portal sidebar is an editorial contact card:
- **Lead Founders**: Alex (Head of Design & Ops) & Priya (Head of Tech & QA)
- **Direct Ops Channel**: `ops@openbench.io` • Expected response: `< 2 hours`.

---

## 4. Frontend Route Guards (`client/src/App.tsx`)

Every authenticated route is wrapped in an explicit `ProtectedRoute` component:

```tsx
<Route
  path="/admin/*"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      {/* Admin Route Tree */}
    </ProtectedRoute>
  }
/>
<Route
  path="/talent/*"
  element={
    <ProtectedRoute allowedRoles={['TALENT']}>
      {/* Talent Route Tree */}
    </ProtectedRoute>
  }
/>
<Route
  path="/client/*"
  element={
    <ProtectedRoute allowedRoles={['CLIENT']}>
      {/* Client Route Tree */}
    </ProtectedRoute>
  }
/>
```

- If an unauthenticated user attempts to access any protected route, they are automatically redirected to `/login?redirect=<target>`.
- If a user with role `CLIENT` attempts to navigate to `/admin/dashboard`, the guard redirects them immediately to `/client/dashboard`.
- If a user with role `TALENT` attempts to navigate to `/client/dashboard`, the guard redirects them immediately to `/talent/dashboard`.

---

## 5. Backend Authorization & IDOR Defense-in-Depth

> [!IMPORTANT]
> **Frontend route hiding is NOT security.** Every backend endpoint independently validates the caller's JWT token, enforces role permission, and asserts resource-level ownership.

### 5.1 RBAC Enforcement Middleware
```typescript
// server/src/middleware/auth.ts
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient privileges for this operational resource',
      });
    }
    next();
  };
};
```

### 5.2 Resource Ownership & IDOR Protection (Database Level)
1. **Client Project Access**:
   ```typescript
   // server/src/controllers/clientController.ts
   const project = await prisma.project.findUnique({ where: { id: projectId } });
   if (!project || project.clientId !== req.user.clientProfileId) {
     return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
   }
   ```
2. **Deliverable Isolation**:
   ```typescript
   // Clients only receive deliverables that have cleared the Founder QA Gate:
   deliverableSubmissions: {
     where: { qaStatus: 'QA_APPROVED' }
   }
   ```
3. **Talent Invitation & SOW Access**:
   ```typescript
   // server/src/controllers/talentController.ts
   const membership = await prisma.projectPodMember.findUnique({ where: { id: podMemberId } });
   if (!membership || membership.talentId !== req.user.talentProfileId) {
     return res.status(404).json({ success: false, message: 'Invitation not found or unauthorized' });
   }
   ```

---

## 6. Elimination of Redundant & Mixed Dashboards

- **No Overlapping Routes**: There are no shared multi-role dashboard pages. Admin, Talent, and Client portals have strictly isolated directory structures in `client/src/pages/`.
- **Zero Cross-Role Leaks**:
  - Admins see high-level GMV, pipeline health, vetting notes, and QA queues.
  - Talent sees transparent gross budgets, itemized platform margins, and their own fixed milestone payouts.
  - Clients see milestone deliverables, escrow deposits, and revision caps.
