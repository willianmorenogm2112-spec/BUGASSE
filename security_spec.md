# Security Specification — E Se Bugasse? Studio

## 1. Data Invariants
1. **Authentication & Email Verification**: All write operations require `request.auth != null` and `request.auth.token.email_verified == true`.
2. **Ownership Isolation**: Every document in `/episodes/{episodeId}` and `/studio_configs/{userId}` belongs strictly to a single `ownerId` matching `request.auth.uid`. Blanket `isSignedIn()` reads or lists without `resource.data.ownerId == request.auth.uid` are prohibited.
3. **Immutable Ownership**: During `update`, `incoming().ownerId == existing().ownerId` and `incoming().id == existing().id`.
4. **Strict Key & Size Enforcement**: All strings have explicit `.size()` boundaries matching `firebase-blueprint.json`, and all writes enforce `keys().hasAll(...)` and `keys().hasOnly(...)`.

## 2. The "Dirty Dozen" Payloads (Rejected with PERMISSION_DENIED)
1. **Unauthenticated Create**: `auth = null`, creating `/episodes/ep-1`.
2. **Unverified Email Create**: `auth.token.email_verified = false`, creating `/episodes/ep-1`.
3. **Identity Spoofing on Create**: `auth.uid = 'userA'`, payload has `ownerId: 'userB'`.
4. **Shadow Field Injection on Create**: Payload includes undeclared field `isAdmin: true`.
5. **ID Poisoning**: Document path `/episodes/invalid id with spaces!`.
6. **Oversized Title DoW Attack**: `title` string length > 200 chars.
7. **Invalid Workflow Stage Enum**: `stage: 'HackedStage'`.
8. **Cross-Tenant Read**: `auth.uid = 'userB'` reading `/episodes/ep-owned-by-userA`.
9. **Blanket List Scraping**: Listing `/episodes` without filtering `ownerId == request.auth.uid`.
10. **Ownership Hijack on Update**: `update` changing `ownerId` from `'userA'` to `'userB'`.
11. **Shadow Field Injection on Update**: `update` adding `extraField: 'malicious'`.
12. **Cross-User Config Modification**: `auth.uid = 'userA'` writing to `/studio_configs/userB`.
