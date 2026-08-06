// Generates a unique NHIS ID like NHIS-2026-00042
const generateNHISId = async () => {
  const year    = new Date().getFullYear();
  const random  = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  return `NHIS-${year}-${random}`;
};

module.exports = generateNHISId;