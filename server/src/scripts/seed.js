import 'dotenv/config';
import mongoose from 'mongoose';
import { User, Post, Comment, Poll, Report } from '../models/index.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/secretspace';

const seedDatabase = async () => {
  try {
    console.log(`[Seed] Connecting to MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to database. Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
      Poll.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log('[Seed] Seeding users...');
    const adminUser = await User.create({
      email: 'admin@campus.edu',
      password: 'adminpassword123',
      pseudonym: 'Campus Guardian #01',
      avatar: {
        id: 'fox',
        name: 'Midnight Fox',
        emoji: '🦊',
        bg: 'bg-surface text-deep border-border',
      },
      collegeTag: 'Campus Central',
      role: 'admin',
      karma: 150,
      stats: { confessionsCount: 2, commentsCount: 5, upvotesReceived: 45 },
    });

    const studentUser = await User.create({
      email: 'student@campus.edu',
      password: 'studentpassword123',
      pseudonym: 'Silent Scholar #42',
      avatar: {
        id: 'owl',
        name: 'Silent Owl',
        emoji: '🦉',
        bg: 'bg-surface text-deep border-border',
      },
      collegeTag: 'Campus North',
      role: 'user',
      karma: 42,
      stats: { confessionsCount: 3, commentsCount: 8, upvotesReceived: 67 },
    });

    console.log('[Seed] Seeding anonymous posts...');
    const post1 = await Post.create({
      content:
        'I accidentally submitted a meme inside my final CS lab assignment PDF on page 4. The professor graded it with "Creative illustration, 10/10". Still wondering if he noticed or is just a legend.',
      category: 'confessions',
      collegeTag: 'Campus North',
      tags: ['#CSDepartment', '#LegendProf', '#LabExam'],
      author: studentUser._id,
      authorPseudonym: 'Silent Scholar #42',
      authorAvatar: studentUser.avatar,
      upvotes: 142,
      downvotes: 3,
      commentCount: 2,
    });

    const post2 = await Post.create({
      content:
        'To whoever leaves sticky notes with wholesome study reminders in Library Floor 3 carrels: you single-handedly got me through Midterm week. Please never stop.',
      category: 'academics',
      collegeTag: 'Central Library',
      tags: ['#LibraryWholesome', '#MidtermSurvival'],
      author: adminUser._id,
      authorPseudonym: 'Campus Guardian #01',
      authorAvatar: adminUser.avatar,
      upvotes: 98,
      downvotes: 1,
      commentCount: 1,
    });

    const post3 = await Post.create({
      content:
        'Hostel 4 water cooler has been dispensing chilled liquid nitrogen temperatures since yesterday morning. Everyone is filling bottles for their room refrigerators.',
      category: 'hostel',
      collegeTag: 'Hostel Block 4',
      tags: ['#HostelHacks', '#CryogenicWater'],
      author: studentUser._id,
      authorPseudonym: 'Silent Scholar #42',
      authorAvatar: studentUser.avatar,
      upvotes: 64,
      downvotes: 2,
      commentCount: 0,
    });

    const post4 = await Post.create({
      content:
        'Found a silver titanium Casio watch by the Engineering fountain benches after the 5 PM lecture rush. Handed it over to the Security Desk at Gate 2 with token #88.',
      category: 'lostfound',
      collegeTag: 'Engineering Quad',
      tags: ['#LostAndFound', '#Gate2Security'],
      author: adminUser._id,
      authorPseudonym: 'Campus Guardian #01',
      authorAvatar: adminUser.avatar,
      upvotes: 35,
      downvotes: 0,
      commentCount: 0,
    });

    console.log('[Seed] Seeding sample comments...');
    await Comment.create({
      post: post1._id,
      content: 'He definitely knew. CS professors live on Reddit.',
      author: adminUser._id,
      authorPseudonym: 'Campus Guardian #01',
      authorAvatar: adminUser.avatar,
      upvotes: 24,
    });

    await Comment.create({
      post: post1._id,
      content: 'Can confirm, our TA graded a paper with Rickroll links as citations last semester.',
      author: studentUser._id,
      authorPseudonym: 'Silent Scholar #42',
      authorAvatar: studentUser.avatar,
      upvotes: 19,
    });

    console.log('[Seed] Seeding sample polls...');
    await Poll.create({
      question: 'Should mandatory minimum lecture attendance be lowered from 75% to 60%?',
      options: [
        { text: 'Yes, 60% allows self-study & projects', votes: 512 },
        { text: 'No, 75% keeps classes disciplined', votes: 78 },
        { text: 'Scrap attendance entirely (optional)', votes: 52 },
      ],
      collegeTag: 'Academic Council Poll',
      author: adminUser._id,
      authorPseudonym: 'Phantom Student #11',
      totalVotes: 642,
      status: 'active',
    });

    await Poll.create({
      question: 'Best survival beverage during 3 AM all-nighter prep?',
      options: [
        { text: 'Night Canteen Double Espresso', votes: 230 },
        { text: 'Iced Matcha / Green Tea', votes: 64 },
        { text: 'Energy Drinks (Sting / Red Bull)', votes: 98 },
        { text: 'Cold Water & Sheer Panic', votes: 26 },
      ],
      collegeTag: 'Campus Food Survey',
      author: studentUser._id,
      authorPseudonym: 'Caffeine Overload #99',
      totalVotes: 418,
      status: 'active',
    });

    await Poll.create({
      question: 'Which framework should we run the annual campus hackathon on?',
      options: [
        { text: 'React + Express / Node.js', votes: 185 },
        { text: 'Next.js + Supabase', votes: 95 },
        { text: 'Django / FastAPI + Python', votes: 40 },
      ],
      collegeTag: 'Department Tech Council',
      author: adminUser._id,
      authorPseudonym: 'Night Coder #02',
      totalVotes: 320,
      status: 'closed',
    });

    console.log('[Seed] Seeding moderation report...');
    await Report.create({
      post: post3._id,
      reportedItemType: 'post',
      reporter: adminUser._id,
      reason: 'Spam or Promotional',
      snippet: 'Hostel 4 water cooler has been dispensing chilled...',
      details: 'Checking if this violates maintenance reporting protocols.',
      status: 'pending',
    });

    console.log('--------------------------------------------------');
    console.log('✅ Synthetic development database seeded successfully!');
    console.log('Admin Account: admin@campus.edu (password: adminpassword123)');
    console.log('Student Account: student@campus.edu (password: studentpassword123)');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
