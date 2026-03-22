# Email Deliverability Guide - Avoid Spam Folder

## 🎯 Current Status

Your emails are going to spam because:
1. ⚠️ Domain is new/has low sender reputation
2. ⚠️ Need to warm up your sending domain
3. ⚠️ Missing some authentication records
4. ⚠️ Email content might trigger spam filters

---

## ✅ Immediate Fixes (Do These First)

### 1. Verify All DNS Records Are Set

Check that these records exist for `francescospizzeria.com`:

```bash
# Check SPF record
nslookup -type=TXT francescospizzeria.com

# Check DKIM record
nslookup -type=TXT resend._domainkey.francescospizzeria.com

# Check DMARC record
nslookup -type=TXT _dmarc.francescospizzeria.com
```

**Expected Results:**

**SPF Record:**
```
v=spf1 include:_spf.resend.com ~all
```

**DKIM Record:**
```
v=DKIM1; k=rsa; p=[long key from Resend]
```

**DMARC Record:**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@francescospizzeria.com
```

### 2. Update DMARC Policy (If Too Strict)

If your DMARC is set to `p=reject`, change it to `p=quarantine` or `p=none` while warming up:

```
v=DMARC1; p=none; rua=mailto:dmarc-reports@francescospizzeria.com
```

This allows emails to be delivered while monitoring for issues.

### 3. Add SPF for Your Main Domain

Make sure you have SPF record for the main domain, not just subdomain:

```
Type: TXT
Name: @ (or francescospizzeria.com)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

---

## 🔥 Domain Warm-Up Strategy

**Why Warming Up Matters:**
- New domains have no sending reputation
- ISPs (Gmail, Outlook) don't trust new senders
- Sudden high volume = spam flag

**Warm-Up Schedule:**

| Week | Daily Limit | Total Week | Action |
|------|------------|------------|---------|
| Week 1 | 10-20 emails | 100 emails | Send to engaged users only |
| Week 2 | 50 emails | 350 emails | Increase gradually |
| Week 3 | 100 emails | 700 emails | Monitor bounce/spam rates |
| Week 4 | 250 emails | 1,750 emails | Normal operations begin |

**Rules During Warm-Up:**
1. ✅ Send to engaged/active customers first
2. ✅ Avoid sending to old/inactive emails
3. ✅ Monitor open rates (should be >20%)
4. ✅ Remove bounced emails immediately
5. ❌ Don't send to purchased email lists
6. ❌ Don't send daily campaigns yet

---

## 📧 Email Content Best Practices

### What Triggers Spam Filters:

**Spam Trigger Words to Avoid:**
- ❌ FREE!!! (excessive punctuation)
- ❌ ACT NOW!!!
- ❌ LIMITED TIME!!!
- ❌ CLICK HERE!!!
- ❌ $$$, !!!!, URGENT
- ❌ Viagra, Casino, Lottery, Winner
- ❌ ALL CAPS SUBJECT LINES

**Your Current Subject:**
```
[TEST] ⭐ Thank You! Here's 25% Off Your Next Order
```

**Better Subject Lines:**
```
✅ Thank you! 25% off your next pizza order
✅ Exclusive offer for loyal customers
✅ Your reward: 25% off at Francesco's
```

### Content Guidelines:

**DO:**
- ✅ Use proper HTML structure
- ✅ Include text version (not just HTML)
- ✅ Add unsubscribe link (legally required)
- ✅ Include physical address in footer
- ✅ Use real reply-to email address
- ✅ Keep image-to-text ratio balanced (60% text, 40% images)
- ✅ Use descriptive alt text for images

**DON'T:**
- ❌ Use all images (no text)
- ❌ Hide text in images
- ❌ Use misleading subject lines
- ❌ Send from no-reply addresses to Gmail
- ❌ Use URL shorteners
- ❌ Embed forms directly in email

---

## 🛡️ Authentication Score Check

Use these free tools to test your email authentication:

### 1. Mail-Tester.com
```
1. Go to https://mail-tester.com
2. Copy the test email address shown
3. Send a test campaign to that address
4. Click "Then check your score"
5. Aim for 8/10 or higher
```

### 2. Google Postmaster Tools
```
1. Go to https://postmaster.google.com
2. Add your domain: francescospizzeria.com
3. Verify domain ownership
4. Monitor:
   - Spam rate (keep under 0.3%)
   - IP reputation
   - Domain reputation
   - Authentication rate
```

### 3. Microsoft SNDS
```
For Outlook/Hotmail deliverability:
1. Go to https://postmaster.live.com/snds/
2. Register your sending IP
3. Monitor reputation score
```

---

## 📊 Resend Dashboard Monitoring

Check these metrics in your Resend dashboard:

**Good Metrics:**
- ✅ Delivery Rate: >95%
- ✅ Open Rate: >20%
- ✅ Bounce Rate: <5%
- ✅ Spam Complaint Rate: <0.1%

**Red Flags:**
- ❌ Bounce Rate: >10% (clean your list)
- ❌ Spam Complaints: >0.5% (stop sending immediately)
- ❌ Unsubscribe Rate: >2% (review content)

---

## 🎯 Resend-Specific Improvements

### 1. Add Custom Return-Path

In your Resend DNS settings, add a custom return-path:

```
Type: CNAME
Name: resend
Value: feedback.resend.com
TTL: 3600
```

### 2. Enable Click & Open Tracking

These improve deliverability signals:
- Open tracking shows engagement
- Click tracking shows legitimate links

### 3. Use Tags Effectively

Already implemented! Tags help Resend monitor campaign performance:
```typescript
tags: [
  { name: 'type', value: 'marketing_campaign' },
  { name: 'campaign', value: 'Loyalty_Reward' },
  { name: 'user_id', value: '123' }
]
```

---

## 💰 Consider Email Warm-Up Service

If you need faster warm-up, use a service:

**Warmup Inbox** (Recommended)
- Cost: ~$19/month
- Automatically sends emails between real accounts
- Builds reputation faster
- Works with Resend

**How it works:**
1. Sign up at warmupinbox.com
2. Connect your Resend SMTP
3. It sends/receives emails automatically
4. Builds sender reputation over 2-4 weeks

---

## 🔍 Test Your Current Setup

Run these commands to check DNS:

```bash
# Check if SPF is set
dig TXT francescospizzeria.com +short | grep spf

# Check if DKIM is set
dig TXT resend._domainkey.francescospizzeria.com +short

# Check if DMARC is set
dig TXT _dmarc.francescospizzeria.com +short
```

**Expected output:**
```
SPF: "v=spf1 include:_spf.resend.com ~all"
DKIM: "v=DKIM1; k=rsa; p=MIGfMA0GCSq..."
DMARC: "v=DMARC1; p=none; rua=mailto:..."
```

---

## ✅ Action Plan (Priority Order)

### Immediate (Do Today):
1. [ ] Check all DNS records are set correctly in Netlify
2. [ ] Test email at mail-tester.com (get score 8+)
3. [ ] Remove "[TEST]" from subject lines
4. [ ] Update DMARC policy to `p=none` if currently `p=reject`
5. [ ] Add physical address to email footer template

### This Week:
1. [ ] Register with Google Postmaster Tools
2. [ ] Send 10-20 test emails to engaged customers
3. [ ] Monitor Resend dashboard for bounces
4. [ ] Create text-only version of email template
5. [ ] Clean email list (remove invalid/bounced emails)

### Ongoing:
1. [ ] Gradually increase email volume (follow warm-up schedule)
2. [ ] Monitor spam complaint rate (keep under 0.1%)
3. [ ] Remove unsubscribes immediately
4. [ ] Send consistent volume (don't spike suddenly)
5. [ ] Engage users (get them to open/click)

---

## 🎨 Email Template Improvements

Your current template is good! But add these:

### 1. Plain Text Version

Create a text-only version for email clients that block HTML:

```
Hello [Name]!

Thank you for being a loyal Francesco's customer!

We're giving you 25% off your next order.

Use code: LOYAL25

Order now: https://francescospizzeria.com

This offer expires in 14 days.

---
Francesco's
5 Regent Park Blvd, Asheville, NC 28806
(828) 225-2885

Unsubscribe: [link]
```

### 2. Add View in Browser Link

Add at the top of email:
```html
<p style="text-align: center; font-size: 12px;">
  <a href="{{ .ViewInBrowserURL }}">View this email in your browser</a>
</p>
```

### 3. Improve Unsubscribe Visibility

Move unsubscribe to be more visible (required by Gmail):
```html
<div style="text-align: center; padding: 20px; background: #f5f5f5;">
  <p>Don't want these emails? <a href="[unsubscribe]">Unsubscribe</a></p>
</div>
```

---

## 🚫 What NOT to Do

**Will Get You Blacklisted:**
- ❌ Buy email lists
- ❌ Send without permission
- ❌ Hide unsubscribe link
- ❌ Use misleading subject lines
- ❌ Send from multiple domains randomly
- ❌ Spike email volume suddenly
- ❌ Ignore spam complaints
- ❌ Use disposable/temporary sending domains

---

## 📞 If Emails Still Go to Spam

### Gmail Users:
1. Ask recipients to add you to contacts
2. Ask them to move email from spam to inbox
3. Ask them to mark as "Not Spam"
4. Create a Gmail filter to whitelist your domain

### For Customers:
Add this to your website/confirmation emails:

```
📧 To ensure you receive our emails:

Gmail: Add orders@francescospizzeria.com to your contacts
Outlook: Move to "Focused" inbox
Yahoo: Add to contacts and mark as "Not Spam"
```

---

## 🎯 Expected Timeline

**Week 1-2:** Emails may still hit spam occasionally
**Week 3-4:** Delivery improves as reputation builds
**Month 2:** Most emails reach inbox
**Month 3+:** Consistent inbox delivery (>95%)

---

## 📈 Success Metrics

Monitor these weekly:

| Metric | Target | Your Current | Status |
|--------|--------|--------------|---------|
| Inbox Rate | >90% | ~50% (spam) | 🟡 Improving |
| Open Rate | >20% | TBD | 🟡 Pending |
| Click Rate | >2% | TBD | 🟡 Pending |
| Bounce Rate | <5% | TBD | 🟡 Monitor |
| Spam Rate | <0.3% | High | 🔴 Fix now |

---

## 🆘 Quick Fixes Summary

**Right Now:**
1. Remove "[TEST]" from subject
2. Check DNS records are all set
3. Test at mail-tester.com
4. Add physical address to footer
5. Set DMARC to `p=none`

**This Week:**
1. Send to 10-20 engaged customers only
2. Monitor Resend dashboard
3. Register with Google Postmaster
4. Create plain text version

**Long Term:**
1. Follow warm-up schedule
2. Maintain consistent sending
3. Clean list regularly
4. Monitor metrics weekly

---

## 🔗 Helpful Resources

- Resend Deliverability Docs: https://resend.com/docs/deliverability
- Mail Tester: https://mail-tester.com
- Google Postmaster: https://postmaster.google.com
- DMARC Analyzer: https://dmarc.org
- MXToolbox: https://mxtoolbox.com/SuperTool.aspx

---

## 💡 Pro Tip

The single best way to avoid spam:
**Only send to people who explicitly asked for your emails and engage with them regularly.**

If customers open, click, and don't mark as spam, ISPs learn to trust you!
