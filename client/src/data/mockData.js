// Realistic synthetic mock data for SecretSpace (Anonymous College Community)

export const CATEGORIES = [
  { id: 'all', label: 'All Feeds', icon: 'Sparkles', color: 'purple' },
  { id: 'confessions', label: 'Confessions', icon: 'Flame', color: 'rose' },
  { id: 'academics', label: 'Academics & Exams', icon: 'GraduationCap', color: 'blue' },
  { id: 'hostel', label: 'Hostel & Mess', icon: 'Home', color: 'amber' },
  { id: 'campus-life', label: 'Campus Life', icon: 'Coffee', color: 'emerald' },
  { id: 'crushes', label: 'Crushes & Vibes', icon: 'Heart', color: 'pink' },
  { id: 'lost-found', label: 'Lost & Found', icon: 'Search', color: 'indigo' },
];

export const AVATAR_OPTIONS = [
  { id: 'ghost', name: 'Phantom Student', color: 'bg-surface text-primary border-border' },
  { id: 'cat', name: 'Campus Stray', color: 'bg-surface text-deep border-border' },
  { id: 'owl', name: 'Night Coder', color: 'bg-surface text-accent border-border' },
  { id: 'fox', name: 'Sneaky Fox', color: 'bg-surface text-primary border-border' },
  { id: 'coffee', name: 'Caffeine Overload', color: 'bg-surface text-deep border-border' },
  { id: 'ninja', name: 'Silent Junior', color: 'bg-surface text-muted border-border' },
];

export const INITIAL_POSTS = [
  {
    id: 'post-1',
    authorPseudonym: 'Phantom Student #419',
    authorAvatar: 'ghost',
    collegeTag: 'Engineering Block B',
    timestamp: '15m ago',
    category: 'confessions',
    content: "Confession: I've been nodding aggressively in every Distributed Systems lecture for 4 weeks straight. The professor actually asked my opinion today and my brain played the dial-up modem sound.",
    upvotes: 84,
    downvotes: 2,
    userVote: null, // 'up' | 'down' | null
    isBookmarked: false,
    commentCount: 14,
    tags: ['#Academics', '#FakeItTillYouMakeIt', '#FinalYear'],
    comments: [
      {
        id: 'c-1',
        author: 'Night Coder #90',
        avatar: 'owl',
        timestamp: '10m ago',
        content: 'Happened to me in OS lab last semester. I mumbled "race condition" and the lab assistant nodded and walked away.',
        upvotes: 29,
        replies: [
          {
            id: 'c-1-1',
            author: 'Phantom Student #419',
            avatar: 'ghost',
            timestamp: '5m ago',
            content: 'Taking notes for next Monday! 😂',
            upvotes: 8,
          }
        ]
      },
      {
        id: 'c-2',
        author: 'Caffeine Overload #12',
        avatar: 'coffee',
        timestamp: '8m ago',
        content: 'He definitely knew you had no idea, professors have a sixth sense for that blank stare.',
        upvotes: 11,
      }
    ]
  },
  {
    id: 'post-2',
    authorPseudonym: 'Caffeine Overload #302',
    authorAvatar: 'coffee',
    collegeTag: 'Boys Hostel 3',
    timestamp: '1h ago',
    category: 'hostel',
    content: "Whoever put heavy running shoes in the 2nd floor washing machine at 1:30 AM: the entire wing thought an earthquake struck. Please have some mercy on people trying to sleep before 8 AM tests.",
    upvotes: 142,
    downvotes: 4,
    userVote: 'up',
    isBookmarked: true,
    commentCount: 22,
    tags: ['#HostelLife', '#WashingMachineWar', '#PeacePlease'],
    comments: [
      {
        id: 'c-3',
        author: 'Silent Junior #08',
        avatar: 'ninja',
        timestamp: '45m ago',
        content: 'It shook my wardrobe door open, I thought we had a ghost encounter.',
        upvotes: 38,
      }
    ]
  },
  {
    id: 'post-3',
    authorPseudonym: 'Sneaky Fox #107',
    authorAvatar: 'fox',
    collegeTag: 'Central Library',
    timestamp: '3h ago',
    category: 'academics',
    content: "Pro-tip for end-terms: 4th floor quiet study room desk #14 has both a working 65W fast charger port and zero glare from windows. Guarding this secret with my life, but sharing it here because SecretSpace is sacred.",
    upvotes: 215,
    downvotes: 1,
    userVote: null,
    isBookmarked: true,
    commentCount: 31,
    tags: ['#LibraryHacks', '#ExamPrep', '#Secrets'],
    comments: [
      {
        id: 'c-4',
        author: 'Night Coder #55',
        avatar: 'owl',
        timestamp: '2h ago',
        content: 'Bro deleted this immediately before the seniors find out!',
        upvotes: 45,
      }
    ]
  },
  {
    id: 'post-4',
    authorPseudonym: 'Campus Stray #77',
    authorAvatar: 'cat',
    collegeTag: 'Main Quadrangle',
    timestamp: '5h ago',
    category: 'crushes',
    content: "To the person in the oversized lavender hoodie reading Murakami outside Canteen 2 today listening to vinyl tracks: your vibe is unreal. Hope you aced whatever exam you were revising for.",
    upvotes: 320,
    downvotes: 6,
    userVote: null,
    isBookmarked: false,
    commentCount: 48,
    tags: ['#CampusCrush', '#LavenderHoodie', '#Wholesome'],
    comments: []
  },
  {
    id: 'post-5',
    authorPseudonym: 'Silent Junior #89',
    authorAvatar: 'ninja',
    collegeTag: 'Student Activity Center',
    timestamp: '8h ago',
    category: 'lost-found',
    content: "Found: Silver Apple Pencil (2nd Gen) with a small cat sticker near SAC Seminar Hall 1 after the robotics workshop. Left it with the front security desk with tag #AP-09.",
    upvotes: 95,
    downvotes: 0,
    userVote: null,
    isBookmarked: false,
    commentCount: 7,
    tags: ['#LostAndFound', '#ApplePencil', '#CampusCommunity'],
    comments: []
  }
];

export const INITIAL_POLLS = [
  {
    id: 'poll-1',
    authorPseudonym: 'Phantom Student #11',
    collegeTag: 'Academic Council Poll',
    timestamp: '2h ago',
    question: 'Should mandatory minimum lecture attendance be lowered from 75% to 60%?',
    totalVotes: 642,
    hasVoted: false,
    userSelectedOption: null,
    status: 'active',
    expiresIn: '2 days left',
    options: [
      { id: 'opt-1', text: 'Yes, 60% allows self-study & projects', votes: 512 },
      { id: 'opt-2', text: 'No, 75% keeps classes disciplined', votes: 78 },
      { id: 'opt-3', text: 'Scrap attendance entirely (optional)', votes: 52 },
    ]
  },
  {
    id: 'poll-2',
    authorPseudonym: 'Caffeine Overload #99',
    collegeTag: 'Campus Food Survey',
    timestamp: '1d ago',
    question: 'Best survival beverage during 3 AM all-nighter prep?',
    totalVotes: 418,
    hasVoted: true,
    userSelectedOption: 'opt-1',
    status: 'active',
    expiresIn: '18 hours left',
    options: [
      { id: 'opt-1', text: 'Night Canteen Double Espresso', votes: 230 },
      { id: 'opt-2', text: 'Iced Matcha / Green Tea', votes: 64 },
      { id: 'opt-3', text: 'Energy Drinks (Sting / Red Bull)', votes: 98 },
      { id: 'opt-4', text: 'Cold Water & Sheer Panic', votes: 26 },
    ]
  },
  {
    id: 'poll-3',
    authorPseudonym: 'Night Coder #02',
    collegeTag: 'Department Tech Council',
    timestamp: '3d ago',
    question: 'Which framework should we run the annual campus hackathon on?',
    totalVotes: 320,
    hasVoted: false,
    userSelectedOption: null,
    status: 'closed',
    expiresIn: 'Ended yesterday',
    options: [
      { id: 'opt-1', text: 'React + Express / Node.js', votes: 185 },
      { id: 'opt-2', text: 'Next.js + Supabase', votes: 95 },
      { id: 'opt-3', text: 'Django / FastAPI + Python', votes: 40 },
    ]
  }
];

export const MOCK_REPORTS = [
  {
    id: 'rep-1',
    postId: 'post-1',
    reason: 'Personal Information / Doxxing risk',
    reportedItemType: 'post',
    snippet: 'Professor name mentioned in comments without consent.',
    flaggedBy: 'Anonymous User #921',
    timestamp: '25m ago',
    status: 'pending',
    severity: 'medium',
  },
  {
    id: 'rep-2',
    postId: 'post-2',
    reason: 'Hostel dispute / Harassment',
    reportedItemType: 'post',
    snippet: 'Hostel room wing number callout.',
    flaggedBy: 'Anonymous User #114',
    timestamp: '2h ago',
    status: 'pending',
    severity: 'low',
  },
  {
    id: 'rep-3',
    postId: 'post-x',
    reason: 'Spam / Commercial promotion',
    reportedItemType: 'comment',
    snippet: 'Unrelated Telegram assignment cheating bot link.',
    flaggedBy: 'Auto-Moderation Filter',
    timestamp: '5h ago',
    status: 'reviewed',
    severity: 'high',
  }
];

export const MOCK_USER = {
  pseudonym: 'Mystic Raven #704',
  avatar: 'ghost',
  college: 'Apex Institute of Technology',
  campusCode: 'APEX-CAMPUS-NORTH',
  joinedDate: 'Joined Oct 2026',
  stats: {
    confessionsCount: 4,
    commentsCount: 19,
    upvotesReceived: 182,
    savedPostsCount: 2,
  },
  badges: ['Early Explorer', 'Campus Verified', 'Night Owl'],
  notifications: [
    { id: 'notif-1', text: 'Someone upvoted your confession in #Engineering Block B', time: '12m ago', unread: true },
    { id: 'notif-2', text: 'Your comment reached 25+ upvotes in Library Hacks!', time: '1h ago', unread: true },
    { id: 'notif-3', text: 'New poll added: Attendance criteria reform', time: '2h ago', unread: false },
  ]
};
