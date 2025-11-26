import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.attendance.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.class.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Super Admin User (Platform-level)
  console.log('👑 Creating Super Admin user...');
  await prisma.user.create({
    data: {
      email: 'superadmin@platform.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Super',
          lastName: 'Admin',
          phone: '+91-9999999999',
          address: 'Platform Headquarters',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
        },
      },
    },
  });

  // Create School
  console.log('🏫 Creating Delhi Public School...');
  const school = await prisma.school.create({
    data: {
      name: 'Delhi Public School',
      code: 'DPS001',
      board: 'CBSE',
      address: 'Mathura Road',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110025',
      phone: '+91-11-26951111',
      email: 'info@dps.edu',
      website: 'https://www.dps.edu',
      principalName: 'Dr. Rajesh Kumar',
      establishedYear: 1949,
    },
  });

  // Create Classes (1-12, Sections A, B, C)
  console.log('📚 Creating 36 classes (1-12, A-C)...');
  const classes: any[] = [];
  for (let grade = 1; grade <= 12; grade++) {
    for (const section of ['A', 'B', 'C']) {
      const classData = await prisma.class.create({
        data: {
          name: grade.toString(),
          section: section,
          academicYear: '2024-2025',
          capacity: 40,
          roomNumber: `${grade}0${section.charCodeAt(0) - 64}`,
          schoolId: school.id,
        },
      });
      classes.push(classData);
    }
  }

  // Create Subjects
  console.log('📚 Creating Subjects...');
  const subjectsList = [
    { name: 'Mathematics', code: 'MATH', type: 'CORE' },
    { name: 'Science', code: 'SCI', type: 'CORE' },
    { name: 'English', code: 'ENG', type: 'CORE' },
    { name: 'Hindi', code: 'HIN', type: 'CORE' },
    { name: 'Social Studies', code: 'SST', type: 'CORE' },
    { name: 'Computer Science', code: 'CS', type: 'ELECTIVE' },
    { name: 'Physics', code: 'PHY', type: 'CORE' },
    { name: 'Chemistry', code: 'CHEM', type: 'CORE' },
    { name: 'Biology', code: 'BIO', type: 'CORE' },
    { name: 'History', code: 'HIST', type: 'CORE' },
    { name: 'Geography', code: 'GEO', type: 'CORE' },
    { name: 'Economics', code: 'ECO', type: 'ELECTIVE' }
  ];

  for (const sub of subjectsList) {
    await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: {
        name: sub.name,
        code: sub.code,
        type: sub.type as any,
        board: 'CBSE',
      },
    });
  }

  // Create Principal
  console.log('👔 Creating Principal...');
  await prisma.user.create({
    data: {
      email: 'principal@dps.edu',
      password: hashedPassword,
      role: 'PRINCIPAL',
      schoolId: school.id, // Linked to School
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Dr. Rajesh',
          lastName: 'Kumar',
          phone: '+91-9876543210',
          dateOfBirth: new Date('1975-05-15'),
          gender: 'MALE',
          address: 'Principal Residence, DPS Campus',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110025',
        },
      },
    },
  });

  // Create Finance Manager
  console.log('💰 Creating Finance Manager...');
  await prisma.user.create({
    data: {
      email: 'finance@dps.edu',
      password: hashedPassword,
      role: 'FINANCE',
      schoolId: school.id, // Linked to School
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Priya',
          lastName: 'Sharma',
          phone: '+91-9876543211',
          dateOfBirth: new Date('1985-08-20'),
          gender: 'FEMALE',
          address: 'Finance Office, DPS Campus',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110025',
        },
      },
    },
  });

  // Create 36 Teachers (3 per grade)
  console.log('👨‍🏫 Creating 36 teachers...');
  const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Economics'];

  for (let i = 0; i < 36; i++) {
    const firstName = ['Amit', 'Sneha', 'Rahul', 'Priya', 'Vikram', 'Anjali', 'Suresh', 'Kavita', 'Ravi', 'Meera'][i % 10];
    const lastName = ['Verma', 'Patel', 'Singh', 'Reddy', 'Gupta', 'Nair', 'Joshi', 'Iyer', 'Chopra', 'Menon'][i % 10];

    await prisma.user.create({
      data: {
        email: `teacher${i + 1}@dps.edu`,
        password: hashedPassword,
        role: 'TEACHER',
        schoolId: school.id, // Linked to School
        emailVerified: true,
        profile: {
          create: {
            firstName,
            lastName,
            phone: `+91-98765432${10 + i}`,
            dateOfBirth: new Date(1980 + (i % 15), (i % 12), (i % 28) + 1),
            gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
            address: `Teacher Quarters ${i + 1}, DPS Campus`,
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110025',
          },
        },
        teacher: {
          create: {
            employeeId: `T${String(i + 1).padStart(4, '0')}`,
            specialization: subjects[i % subjects.length],
            qualification: i % 3 === 0 ? 'PhD' : i % 2 === 0 ? 'M.Ed' : 'B.Ed',
            experience: 5 + (i % 15),
            salary: 50000 + (i * 1000),
            joiningDate: new Date(2015 + (i % 10), (i % 12), 1),
          },
        },
      },
    });
  }

  // Create 100 Students with Parents
  console.log('👨‍🎓 Creating 100 students with parents...');
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya',
    'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Kiara', 'Anika', 'Navya', 'Angel', 'Pari', 'Myra'];
  const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Joshi', 'Nair', 'Iyer'];

  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const randomClass = classes[Math.floor(Math.random() * classes.length)];

    // Create Parent
    const parent = await prisma.user.create({
      data: {
        email: `parent${i + 1}@email.com`,
        password: hashedPassword,
        role: 'PARENT',
        schoolId: school.id, // Linked to School
        emailVerified: true,
        profile: {
          create: {
            firstName: `${firstName}'s Parent`,
            lastName: lastName,
            phone: `+91-98000${String(i).padStart(5, '0')}`,
            dateOfBirth: new Date(1975 + (i % 20), (i % 12), (i % 28) + 1),
            gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
            address: `House ${i + 1}, Sector ${(i % 20) + 1}, Delhi`,
            city: 'New Delhi',
            state: 'Delhi',
            pincode: `1100${String((i % 90) + 10).padStart(2, '0')}`,
          },
        },
        parent: {
          create: {},
        },
      },
      include: {
        parent: true,
      },
    });

    // Create Student
    await prisma.user.create({
      data: {
        email: `student${i + 1}@dps.edu`,
        password: hashedPassword,
        role: 'STUDENT',
        schoolId: school.id, // Linked to School
        emailVerified: true,
        profile: {
          create: {
            firstName,
            lastName,
            phone: `+91-99000${String(i).padStart(5, '0')}`,
            dateOfBirth: new Date(2006 + (i % 12), (i % 12), (i % 28) + 1),
            gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
            address: `House ${i + 1}, Sector ${(i % 20) + 1}, Delhi`,
            city: 'New Delhi',
            state: 'Delhi',
            pincode: `1100${String((i % 90) + 10).padStart(2, '0')}`,
          },
        },
        student: {
          create: {
            admissionNumber: `DPS${String(i + 1).padStart(5, '0')}`,
            rollNumber: `${randomClass.name}${randomClass.section}${String((i % 40) + 1).padStart(2, '0')}`,
            classId: randomClass.id,
            parentId: parent.parent!.id,
            admissionDate: new Date(2015 + (i % 10), 3, 1),
            bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'][i % 8],
            emergencyPhone: `+91-98000${String(i).padStart(5, '0')}`,
          },
        },
      },
    });

    if ((i + 1) % 20 === 0) {
      console.log(`   ✓ Created ${i + 1} students...`);
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - 1 School (Delhi Public School)`);
  console.log(`   - 1 Principal (principal@dps.edu)`);
  console.log(`   - 1 Finance Manager (finance@dps.edu)`);
  console.log(`   - 36 Teachers (teacher1@dps.edu - teacher36@dps.edu)`);
  console.log(`   - 100 Students (student1@dps.edu - student100@dps.edu)`);
  console.log(`   - 100 Parents (parent1@email.com - parent100@email.com)`);
  console.log(`   - 36 Classes (1A-12C)`);
  console.log(`   - 12 Subjects (CBSE)`);
  console.log(`\n🔑 All passwords: password123`);
  console.log(`\n📝 Role-Based Access:`);
  console.log(`   - Principal → Purple Dashboard (Full Access)`);
  console.log(`   - Finance → Yellow Dashboard (Finance Management)`);
  console.log(`   - Teachers → Green Dashboard (Class Management)`);
  console.log(`   - Students → Blue Dashboard (View Grades/Attendance)`);
  console.log(`   - Parents → Pink Dashboard (View Child's Progress)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



