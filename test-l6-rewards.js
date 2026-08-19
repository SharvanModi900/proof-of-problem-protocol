#!/usr/bin/env node

/**
 * PoPP Layer 6 Reward System Test
 * 
 * This script tests the complete reward flow:
 * 1. Get escalated submissions
 * 2. Resolve one
 * 3. Check rewards
 */

const API_BASE = 'http://localhost:8080'; // Change to your backend URL

// You'll need to replace this with a real token
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';

async function test() {
  console.log('🧪 Testing PoPP Layer 6 Reward System...\n');

  // Step 1: Get escalated submissions
  console.log('📋 Step 1: Fetching escalated submissions...');
  const submissionsRes = await fetch(`${API_BASE}/api/submissions?status=escalated&limit=5`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  if (!submissionsRes.ok) {
    console.error('❌ Failed to fetch submissions:', submissionsRes.status);
    return;
  }
  
  const submissions = await submissionsRes.json();
  console.log(`✅ Found ${submissions.length} escalated submissions\n`);
  
  if (submissions.length === 0) {
    console.log('⚠️  No escalated submissions found.');
    console.log('💡 Create a submission and push it through L1-L5 first.');
    return;
  }
  
  // Step 2: Resolve the first submission
  const submission = submissions[0];
  console.log(`🔧 Step 2: Resolving submission ${submission.id}...`);
  console.log(`   Title: ${submission.title}`);
  console.log(`   Status: ${submission.status}\n`);
  
  const resolveRes = await fetch(`${API_BASE}/api/resolutions/${submission.id}/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    },
    body: JSON.stringify({
      resolution_type: 'fixed',
      resolution_notes: 'Test resolution - issue fixed by municipal team',
      before_photo_url: 'https://example.com/before.jpg',
      after_photo_url: 'https://example.com/after.jpg'
    })
  });
  
  if (!resolveRes.ok) {
    console.error('❌ Failed to resolve submission:', resolveRes.status);
    const error = await resolveRes.text();
    console.error(error);
    return;
  }
  
  const resolution = await resolveRes.json();
  console.log('✅ Submission resolved!');
  console.log(`   Resolution ID: ${resolution.id}`);
  console.log(`   Submitter Reward: ${resolution.submitter_reward} POPPT`);
  console.log(`   Validator Reward: ${resolution.validator_credit_each} POPPT each`);
  console.log(`   Total Distributed: ${resolution.total_rewards_distributed} POPPT`);
  console.log(`   Validators Rewarded: ${resolution.validators_rewarded}\n`);
  
  // Step 3: Check user rewards
  console.log('👤 Step 3: Checking user rewards...');
  const userRes = await fetch(`${API_BASE}/api/users/me`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  if (!userRes.ok) {
    console.error('❌ Failed to fetch user data:', userRes.status);
    return;
  }
  
  const user = await userRes.json();
  console.log('✅ User data:');
  console.log(`   POPPT Credits: ${user.popp_credits}`);
  console.log(`   R-Score: ${user.r_score}`);
  console.log(`   Tickets Resolved: ${user.tickets_resolved}`);
  console.log(`   Validations Done: ${user.validations_done}\n`);
  
  // Step 4: Check reward history
  console.log('📜 Step 4: Checking reward history...');
  const historyRes = await fetch(`${API_BASE}/api/rewards/history`, {
    headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
  });
  
  if (!historyRes.ok) {
    console.error('❌ Failed to fetch reward history:', historyRes.status);
    return;
  }
  
  const history = await historyRes.json();
  console.log('✅ Reward history:');
  console.log(`   Total Earned: ${history.total_earned} POPPT`);
  console.log(`   Total R-Score Change: ${history.total_r_score_change}`);
  console.log(`   Reward Count: ${history.count}`);
  
  if (history.history && history.history.length > 0) {
    console.log('\n   Recent rewards:');
    history.history.slice(0, 3).forEach((r, i) => {
      console.log(`   ${i+1}. ${r.reward_type}: ${r.amount} POPPT (R-Score: ${r.r_score_delta > 0 ? '+' : ''}${r.r_score_delta})`);
    });
  }
  
  console.log('\n✅ L6 Reward System Test Complete!');
  console.log('\n💡 If rewards are still 0, check:');
  console.log('   1. Backend logs for errors');
  console.log('   2. Database: SELECT * FROM reward_ledger ORDER BY created_at DESC LIMIT 10;');
  console.log('   3. Database: SELECT popp_credits, r_score FROM users WHERE id = \'your_user_id\';');
}

test().catch(err => {
  console.error('❌ Test failed:', err);
});
