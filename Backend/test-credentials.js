const bcrypt = require('bcryptjs');

// Test the current password hash
const testPassword = 'santa123';
const currentHash = '$2a$10$8K1p/a0drtIzIb7s2aHD.OinDdMdmZs0SfbdotM3C5ExD8.wd/nDO';

console.log('🎅 Testing Santa\'s Credentials...');
console.log('Email: santa@northpole.com');
console.log('Password: santa123');
console.log('');

bcrypt.compare(testPassword, currentHash, (err, result) => {
  if (err) {
    console.error('❌ Error testing password:', err);
    return;
  }
  
  if (result) {
    console.log('✅ Password "santa123" is CORRECT!');
  } else {
    console.log('❌ Password "santa123" is INCORRECT!');
    console.log('');
    console.log('Generating new hash for "santa123"...');
    
    bcrypt.hash(testPassword, 10, (err, newHash) => {
      if (err) {
        console.error('Error generating hash:', err);
        return;
      }
      console.log('New hash:', newHash);
      console.log('');
      console.log('Update the adminUser.password in authRoutes.js with this hash:');
      console.log(`password: '${newHash}',`);
    });
  }
});

// Also test some alternative passwords
const alternatives = ['Santa123', 'SANTA123', 'santa', 'christmas'];
console.log('');
console.log('Testing alternative passwords...');

alternatives.forEach(alt => {
  bcrypt.compare(alt, currentHash, (err, result) => {
    if (result) {
      console.log(`✅ Alternative password "${alt}" works!`);
    }
  });
});