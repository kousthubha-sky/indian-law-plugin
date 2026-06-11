---
id: cert-in
title: CERT-In Directions 2022 — Cybersecurity Incident Reporting & Logging
applies_to: [all]
status: "Active and enforced since June 2022; all ICT entities in India must comply"
penalty: "Up to ₹1 lakh fine; repeated non-compliance may result in regulatory action"
sources:
  - https://www.cert-in.org.in/
  - https://www.cert-in.org.in/directions-2022
  - https://www.incorpx.io/blog/cert-in-cybersecurity-compliance-2026
  - https://amlegals.com/cert-in-compliance-guide-2025/
---

# CERT-In Directions 2022

Issued under §70B(6) of the IT Act 2000, these directions apply to ALL "service providers,
intermediaries, data centres, body corporates and government organizations" — effectively
any company or individual running ICT systems in India.

---

### OBL-CERT-01 — 6-hour cybersecurity incident reporting
- **requirement:** Report any cybersecurity incident from the reportable category (see below) to CERT-In within **6 hours of becoming aware** of the incident. Report to: incident@cert-in.org.in.
- **reportable_incidents (partial):** Unauthorized access / data exfiltration, malware infection, ransomware, DDoS, website defacement, phishing attacks using the org's domain, credential compromise, vulnerability exploitation, data breach. Full list: cert-in.org.in/directions-2022.
- **applies_when:** All ICT systems
- **evidence_hints:** Incident response runbook or playbook file; `incident-response` docs; monitoring/alerting config with CERT-In escalation path; scripts that notify incident@cert-in.org.in
- **severity:** critical
- **remediation:** REM-BREACH-01 (includes CERT-In 6h path alongside DPDP 72h path). Prepare a CERT-In report template. Set up automated alerting (Sentry, PagerDuty, CloudWatch) with an escalation rule at 1-hour mark to ensure 6-hour deadline is met.
- **citation:** CERT-In Directions 2022, Direction 6(a)

### OBL-CERT-02 — 180-day log retention (rolling)
- **requirement:** Maintain all ICT system logs for a minimum of **180 rolling days**. Logs must be available for production to CERT-In on demand.
- **log_types_required:** Login/authentication events; data access and modification events; admin and privileged actions; network traffic (firewall, DNS); application events (API calls, errors, config changes); system events (restarts, process spawns).
- **applies_when:** All ICT systems
- **evidence_hints:** Log retention config in ELK/CloudWatch/Datadog/Splunk; logging middleware configuration; `retentionInDays: 180` or equivalent in logging/cloud config; `LOGS_RETENTION_DAYS` env var
- **severity:** high
- **remediation:** REM-CERTLN-01. Set retention policy to ≥ 180 days on the logging platform. Confirm with: AWS CloudWatch → Retention → 180 days; GCP Logging → Log buckets → retention. Add structured logging (JSON lines) with: timestamp, user_id, action, resource, ip_address.
- **citation:** CERT-In Directions 2022, Direction 6(b)

### OBL-CERT-03 — Logs stored within India
- **requirement:** ICT system logs must be stored **within India**. Offshore log storage does not satisfy this requirement.
- **applies_when:** All ICT systems
- **evidence_hints:** Log forwarder destination (Datadog US, Splunk Cloud EU, Elastic Cloud non-India regions); `AWS_REGION` or `GCP_REGION` for logging infrastructure; Terraform/CDK IaC specifying log storage region
- **severity:** high
- **remediation:** Move log storage to India-region: AWS `ap-south-1` (Mumbai), GCP `asia-south1` (Mumbai), Azure India Central. Update IaC, env vars, logging config. For SaaS logging tools (Datadog, Splunk), check India region availability or use a self-hosted/India-hosted alternative.
- **citation:** CERT-In Directions 2022, Direction 6(b)

### OBL-CERT-04 — NTP clock synchronization to NIC/NPL
- **requirement:** All ICT system clocks must be synchronized to **Indian government NTP servers** (NIC or NPL) or an NTP source traceable to them. Ensures log timestamps are legally accurate.
- **ntp_servers:**
  - NIC: `time.nic.in`
  - NPL: `time.nplindia.org`
- **applies_when:** All servers, VMs, containers running ICT systems
- **evidence_hints:** `/etc/chrony.conf`, `/etc/ntp.conf`, `/etc/systemd/timesyncd.conf`; Dockerfile ENV for time zone; Kubernetes DaemonSet for NTP; Ansible/Terraform provisioning scripts with NTP config
- **severity:** medium
- **remediation:** REM-NTP-01. For Docker: NTP is inherited from the host — configure the host. For managed cloud VMs: use cloud NTP that is traceable to NIC/NPL, or override with `time.nic.in`. Verify: `chronyc tracking` or `timedatectl show`.
- **citation:** CERT-In Directions 2022, Direction 6(c)

### OBL-CERT-05 — KYC for cloud and VPN services
- **requirement:** VPN service providers and cloud infrastructure providers operating in India must maintain KYC records of their subscribers/customers. If your company uses VPN or cloud services registered in India, verify KYC was completed during account setup.
- **applies_when:** Companies using VPN or cloud services (primarily a duty on the service provider, but the subscriber must ensure their account is KYC-compliant)
- **evidence_hints:** Cloud account registration documentation; VPN subscription invoice showing KYC confirmation — not checkable from code (manual review item)
- **severity:** low
- **remediation:** Not auto-verifiable. Add to manual review checklist: confirm cloud provider account (AWS, GCP, Azure) has completed KYC; confirm any corporate VPN subscription is from a CERT-In compliant provider. Retain KYC confirmation document.
- **citation:** CERT-In Directions 2022, Direction 7
