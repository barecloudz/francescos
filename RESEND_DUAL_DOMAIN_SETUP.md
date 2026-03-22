# Resend Dual-Domain Email Setup Guide

## ✅ Strategy: Main Domain + Subdomain

Your app uses **two different domains** for sending emails:

| Email Type | Sent From | Why |
|------------|-----------|-----|
| **Order Confirmations** | `orders@francescospizzeria.com` | Main domain = trusted, critical |
| **Password Resets** | `noreply@francescospizzeria.com` | Main domain = trusted, critical |
| **Marketing Campaigns** | `noreply@updates.francescospizzeria.com` | Subdomain = isolated reputation |

**All replies go to:** `info@francescospizzeria.com`

---

## 🎯 Why This Strategy?

### Transactional Emails (Main Domain):
✅ **Critical** - customers NEED order confirmations
✅ **Trusted** - customers recognize your actual business domain
✅ **Maximum deliverability** - main domain has best reputation
✅ **Professional** - `orders@francescospizzeria.com` > `noreply@updates...`

### Marketing Emails (Subdomain):
✅ **Isolated** - spam complaints don't affect critical emails
✅ **Protected** - keeps your main domain reputation clean
✅ **Monitored** - track marketing performance separately
✅ **Scalable** - can add more subdomains for different campaigns

---

## 📋 Setup Steps

### ✅ Step 1: Verify Subdomain (DONE!)

You already completed this:
- Domain verified: `updates.francescospizzeria.com`
- DNS records added (MX, SPF, DKIM, DMARC)
- Status: **Verified** ✅

---

### 🔧 Step 2: Verify Main Domain (REQUIRED!)

Since order confirmations send from `orders@francescospizzeria.com`, you need to verify the main domain too.

**In Resend Dashboard:**

1. Click **"Domains"** → **"Add Domain"**
2. Enter: `francescospizzeria.com` (main domain, not subdomain)
3. Resend will show DNS records to add

**Add These Records to Netlify DNS:**

Resend will show you exact values, but they'll look similar to:

#### SPF Record:
```
Type: TXT
Name: francescospizzeria.com (or just "@")
Value: v=spf1 include:_spf.resend.com ~all
TTL: Auto
```

#### DKIM Record:
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCS... [long string from Resend]
TTL: Auto
```

#### DMARC Record:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@francescospizzeria.com
TTL: Auto
```

**Note:** If you already have SPF or DMARC records, you'll need to **merge** them:

**Existing SPF:**
```
v=spf1 include:netlify.com ~all
```

**Updated SPF (merged):**
```
v=spf1 include:_spf.resend.com include:netlify.com ~all
```

---

### Step 3: Get Resend API Key (if not done yet)

1. Resend Dashboard → **"API Keys"**
2. Click **"Create API Key"**
3. Name: "Francescos Pizza Production"
4. Copy the key (starts with `re_...`)

---

### Step 4: Add API Key to Netlify

**In Netlify Dashboard:**
1. Site Configuration → Environment Variables
2. Add variable:
   ```
   Key: RESEND_API_KEY
   Value: re_your_api_key_here
   ```
3. Save (Netlify auto-redeploys)

---

## 🧪 Testing Your Setup

### Test 1: Marketing Email (Subdomain)

**Via Admin Dashboard:**
1. Go to `https://francescospizzeria.com/admin`
2. Click **"Email Marketing"** tab
3. Create Campaign → Select template
4. **Test Mode** → Enter your email
5. Send

**Check email:**
- FROM: `Francescos Pizzeria <noreply@updates.francescospizzeria.com>` ✅
- REPLY-TO: `info@francescospizzeria.com` ✅

---

### Test 2: Order Confirmation (Main Domain)

**Place a test order:**
1. Add items to cart
2. Complete checkout
3. Check your email

**Check email:**
- FROM: `Francescos Pizzeria <orders@francescospizzeria.com>` ✅
- REPLY-TO: `info@francescospizzeria.com>` ✅
- Subject: `Order Confirmation - #12345 | Francescos Pizzeria` ✅

---

## 📊 Domain Verification Status

Check both domains are verified in Resend:

| Domain | Status | Used For |
|--------|--------|----------|
| `updates.francescospizzeria.com` | ✅ Verified | Marketing campaigns |
| `francescospizzeria.com` | ⏳ Pending | Order confirmations, password resets |

**Both must show green checkmarks before emails will send!**

---

## 🔍 Troubleshooting

### Issue: "Domain not verified" error

**Solution:**
1. Check DNS records are added correctly in Netlify
2. Wait 30 minutes for DNS propagation
3. Click "Verify" button in Resend dashboard
4. Check for typos in record values

---

### Issue: Emails from main domain not sending

**Solution:**
1. Verify `francescospizzeria.com` is verified in Resend (green checkmark)
2. Check `RESEND_API_KEY` is set in Netlify
3. Check Netlify function logs for errors
4. Ensure DNS records for main domain are correct

---

### Issue: SPF record conflict

If you get "SPF record already exists":

**Bad (multiple SPF records):**
```
v=spf1 include:netlify.com ~all
v=spf1 include:_spf.resend.com ~all  ❌ Won't work!
```

**Good (merged SPF record):**
```
v=spf1 include:netlify.com include:_spf.resend.com ~all  ✅
```

Only ONE SPF record per domain is allowed. Merge all includes into one record.

---

## 🎨 Email Branding

Your emails will show as:

**Marketing Emails:**
```
From: Francescos Pizzeria <noreply@updates.francescospizzeria.com>
Reply-To: info@francescospizzeria.com
```

**Order Confirmations:**
```
From: Francescos Pizzeria <orders@francescospizzeria.com>
Reply-To: info@francescospizzeria.com
```

**Password Resets:**
```
From: Francescos Pizzeria <noreply@francescospizzeria.com>
Reply-To: info@francescospizzeria.com
```

Customers see **"Francescos Pizzeria"** in their inbox, with the technical email address in small print.

---

## 📈 Deliverability Best Practices

1. **Warm up slowly** - Don't send thousands of emails immediately
2. **Monitor bounces** - Check Resend dashboard for bounce rates
3. **Respect opt-outs** - Honor unsubscribe requests immediately
4. **Send relevant content** - Only email customers who opted in
5. **Authenticate properly** - Ensure SPF, DKIM, DMARC all pass
6. **Use clear subject lines** - No spammy words like "FREE!!!"
7. **Include physical address** - Required by CAN-SPAM law (in email footer)

---

## ✅ Checklist

- [x] Subdomain verified: `updates.francescospizzeria.com`
- [ ] Main domain verified: `francescospizzeria.com`
- [ ] API key created in Resend
- [ ] API key added to Netlify environment variables
- [ ] Test marketing email sent successfully
- [ ] Test order confirmation sent successfully
- [ ] Both domains show green checkmarks in Resend
- [ ] Code deployed to production

---

## 🚀 Next Steps

Once both domains are verified:

1. Deploy your code changes:
   ```bash
   git push origin preview
   ```

2. Test both email types (marketing + order confirmation)

3. Monitor Resend dashboard for:
   - Delivery rates
   - Bounce rates
   - Spam complaints

4. Set up email templates for:
   - Welcome emails
   - Birthday offers
   - Win-back campaigns

---

## 💡 Pro Tips

**For maximum deliverability:**
- Keep main domain clean (only transactional emails)
- Use subdomain for all promotional content
- Monitor spam complaint rates in Resend
- Ask customers to whitelist both domains
- Include unsubscribe link in all marketing emails (already built-in)

**Email best practices:**
- Personalize with customer name
- Mobile-responsive templates (already done ✅)
- Clear call-to-action buttons
- Professional branding
- Test before sending to all customers

---

## 📞 Support

If you need help:
- Resend Docs: https://resend.com/docs
- Resend Support: https://resend.com/support
- Check Netlify function logs for errors
- Review `EMAIL_SUBDOMAIN_SETUP.md` for subdomain setup details
