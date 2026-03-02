#!/usr/bin/env python3
"""
SOCIALE Wholesale Email Campaign
Sends 20 personalized emails per day via Gmail API
"""

import base64
import json
import urllib.request
import urllib.error
import time
from datetime import datetime

# Configuration - Set in Vercel/VPS environment variables
import os
ACCESS_TOKEN = os.environ.get('GMAIL_ACCESS_TOKEN', '')
SENDER_EMAIL = os.environ.get('WHOLESALE_EMAIL', 'alex@socialefragrances.com')
SENDER_NAME = os.environ.get('SENDER_NAME', 'Alex Cesarini')

# Top 17 Prospects (in priority order)
PROSPECTS = [
    {
        "name": "Wendy",
        "store": "Back 40 Mercantile",
        "email": "wendy@back40mercantile.com",
        "city": "Old Greenwich",
        "notes": "Explicitly supports small makers"
    },
    {
        "name": "Kimberly",
        "store": "dwell New Haven",
        "email": "info@dwellnewhaven.com",
        "city": "New Haven",
        "notes": "Already sells candles! Owner Kimberly Pedrick"
    },
    {
        "name": "",
        "store": "J. Seitz & Co.",
        "email": "",  # Need to find
        "city": "New Preston",
        "notes": "Best Boutique winner"
    },
    {
        "name": "",
        "store": "Bissell Pharmacy",
        "email": "",  # Need to find
        "city": "Ridgefield",
        "notes": "Gift shop upstairs"
    },
    {
        "name": "",
        "store": "AvaGrace",
        "email": "",  # Need to find
        "city": "Simsbury",
        "notes": "Already sells candles!"
    },
    {
        "name": "Jennifer",
        "store": "Juniper Collective",
        "email": "",  # Need to find
        "city": "Millbrook, NY",
        "notes": "Expertly curated"
    },
    {
        "name": "Janet",
        "store": "Bungalow Decor",
        "email": "info@bungalowdecor.com",
        "city": "Westport",
        "notes": "High-end décor focus"
    },
    {
        "name": "Karen",
        "store": "The Whitney Shop",
        "email": "karen@thewhitneyshop.com",
        "city": "New Canaan",
        "notes": "Since 1947, 2nd generation"
    },
    {
        "name": "",
        "store": "Bella Home",
        "email": "",  # Need to find
        "city": "Ridgefield",
        "notes": "21+ years"
    },
    {
        "name": "",
        "store": "Coco Lily",
        "email": "",  # Need to find
        "city": "Avon",
        "notes": "15+ years"
    },
    {
        "name": "Ellen",
        "store": "The Heron Shop",
        "email": "",  # Need to find
        "city": "Kent",
        "notes": "Former craft gallery"
    },
    {
        "name": "",
        "store": "Terston Home Accents",
        "email": "",  # Need to find
        "city": "Kent",
        "notes": "Home focus"
    },
    {
        "name": "",
        "store": "Walker-Loden",
        "email": "walkerlodenltd@gmail.com",
        "city": "New Haven",
        "notes": "3 locations, since 1989"
    },
    {
        "name": "",
        "store": "Winter Sun Summer Moon",
        "email": "contactus@wintersunsummermoon.com",
        "city": "Rhinebeck, NY",
        "notes": "Local artisans, eclectic boutique"
    },
    {
        "name": "",
        "store": "Pink Olive Cold Spring",
        "email": "coldspring@pinkolive.com",
        "city": "Cold Spring, NY",
        "notes": "Makes their own candles, multiple locations"
    },
    {
        "name": "",
        "store": "Palmer's Market",
        "email": "info@palmersdarien.com",
        "city": "Darien",
        "notes": "100+ years, sells candles, family owned"
    },
    {
        "name": "Diane",
        "store": "Browne & Co.",
        "email": "dlbrowne1@mac.com",
        "city": "Darien",
        "notes": "Eat-Shop-Entertain"
    }
]

def send_email(to_email, subject, body, prospect_name="", store_name=""):
    """Send email via Gmail API"""
    
    # Personalize body
    personalized_body = body.replace("{{first_name}}", prospect_name if prospect_name else "there")
    personalized_body = personalized_body.replace("{{store_name}}", store_name if store_name else "your store")
    
    # Create email
    email_content = f"""From: {SENDER_NAME} <{SENDER_EMAIL}>
To: {to_email}
Subject: {subject}

{personalized_body}
"""
    
    encoded_email = base64.urlsafe_b64encode(email_content.encode()).decode()
    payload = json.dumps({"raw": encoded_email}).encode()
    
    req = urllib.request.Request(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        data=payload,
        headers={
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read().decode())
            return True, result.get('id')
    except urllib.error.HTTPError as e:
        return False, f"{e.code}: {e.reason}"
    except Exception as e:
        return False, str(e)

# Email 1 Template - Authentic Alex Voice
EMAIL_1_SUBJECT = "Candles that tell stories (not boring ones)"

EMAIL_1_BODY = """Hey {{first_name}},

Full disclosure: I'm not great at sales emails. But I'm really good at making candles, and I'm hoping {{store_name}} might be a good home for them.

Here's the thing: I started SOCIALE in my basement in Litchfield, CT back in 2021. No investors. No fancy backing. Just me, some soy wax, and a belief that candles should actually smell good without giving you a headache. (No synthetic garbage. No paraffin. Just clean ingredients that burn slow.)

Fast forward to now, and we've got collections that tell stories:
• The "Ma" collection for millennial moms who wore Love Spell in 2004 and became their mothers (it's a compliment, trust us)
• Pride Collection celebrating the places that shaped LGBTQ+ history
• Boyfriend Collection because sometimes you just need a candle that gets the joke

Why I'm reaching out to {{store_name}} specifically: Your place has the vibe. The curated, "this actually means something" energy that our customers get. We're not trying to be in every big-box store. We want to be in the shops where people discover something real.

The boring business stuff (because I know you need it):
• 50% margins ($16 wholesale / $32 retail)
• $150 minimum opening order
• Net 30, free shipping over $250
• Connecticut-made, hand-poured in small batches

Honestly? I'd rather just send you a candle and let it speak for itself. If you like it, we can talk. If not, no hard feelings.

What do you think? Worth a shot?

Alex
Founder, SOCIALE Fragrances
alex@socialefragrances.com
860-488-4947

P.S. - Our "Ma" candle is launching for Mother's Day and honestly? It's really good. Just saying.
"""

def run_campaign(batch_size=5):
    """Send emails to prospects"""
    print(f"\n{'='*60}")
    print(f"SOCIALE Wholesale Campaign - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}\n")
    
    sent_count = 0
    failed_count = 0
    
    # Send to prospects with email addresses first
    for prospect in PROSPECTS[:batch_size]:
        if not prospect.get('email'):
            print(f"⚠️  Skipping {prospect['store']} - no email")
            continue
            
        print(f"Sending to: {prospect['name']} at {prospect['store']} ({prospect['email']})")
        
        success, result = send_email(
            prospect['email'],
            EMAIL_1_SUBJECT,
            EMAIL_1_BODY,
            prospect.get('name', ''),
            prospect.get('store', '')
        )
        
        if success:
            print(f"✅ Sent! Message ID: {result}")
            sent_count += 1
        else:
            print(f"❌ Failed: {result}")
            failed_count += 1
        
        # Rate limiting - 1 second between emails
        time.sleep(1)
    
    print(f"\n{'='*60}")
    print(f"Batch Complete: {sent_count} sent, {failed_count} failed")
    print(f"{'='*60}\n")
    
    return sent_count, failed_count

if __name__ == "__main__":
    # Send first batch of 5
    run_campaign(batch_size=5)
