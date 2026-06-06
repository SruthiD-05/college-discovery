import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const colleges = [
  { name: "IIT Bombay", location: "Mumbai", state: "Maharashtra", type: "Public", fees: 200000, rating: 4.8 },
  { name: "IIT Delhi", location: "New Delhi", state: "Delhi", type: "Public", fees: 210000, rating: 4.7 },
  { name: "BITS Pilani", location: "Pilani", state: "Rajasthan", type: "Private", fees: 450000, rating: 4.5 },
  { name: "NIT Trichy", location: "Tiruchirappalli", state: "Tamil Nadu", type: "Public", fees: 150000, rating: 4.3 },
  { name: "VIT Vellore", location: "Vellore", state: "Tamil Nadu", type: "Private", fees: 380000, rating: 4.1 },
  { name: "Manipal Institute", location: "Manipal", state: "Karnataka", type: "Private", fees: 420000, rating: 4.0 },
  { name: "IIT Madras", location: "Chennai", state: "Tamil Nadu", type: "Public", fees: 205000, rating: 4.8 },
  { name: "Delhi University", location: "New Delhi", state: "Delhi", type: "Public", fees: 50000, rating: 4.0 },
  { name: "Jadavpur University", location: "Kolkata", state: "West Bengal", type: "Public", fees: 80000, rating: 4.2 },
  { name: "SRM University", location: "Chennai", state: "Tamil Nadu", type: "Private", fees: 350000, rating: 3.9 },
  { name: "IIT Kanpur", location: "Kanpur", state: "Uttar Pradesh", type: "Public", fees: 208000, rating: 4.7 },
  { name: "IIT Kharagpur", location: "Kharagpur", state: "West Bengal", type: "Public", fees: 195000, rating: 4.6 },
  { name: "IIIT Hyderabad", location: "Hyderabad", state: "Telangana", type: "Public", fees: 320000, rating: 4.4 },
  { name: "Amity University", location: "Noida", state: "Uttar Pradesh", type: "Private", fees: 400000, rating: 3.8 },
  { name: "Christ University", location: "Bangalore", state: "Karnataka", type: "Private", fees: 280000, rating: 3.9 },
]

async function main() {
  for (const college of colleges) {
    const created = await prisma.college.create({
      data: {
        ...college,
        placement: {
          create: {
            avgPackage: Math.random() * 10 + 5,
            highestPkg: Math.random() * 30 + 20,
            placementPct: Math.random() * 20 + 80,
          }
        },
        courses: {
          create: [
            { name: "B.Tech Computer Science", duration: 4, fees: college.fees },
            { name: "B.Tech Electronics", duration: 4, fees: college.fees - 10000 },
            { name: "MBA", duration: 2, fees: Math.round(college.fees * 1.5) },
          ]
        },
        reviews: {
          create: [
            { rating: 4.5, comment: "Great faculty and infrastructure." },
            { rating: 4.0, comment: "Good placements and campus life." },
          ]
        }
      }
    })
    console.log(`Created: ${created.name}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())