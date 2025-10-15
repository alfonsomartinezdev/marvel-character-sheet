import { Character } from '../types/Character';

export const puppet: Character = {
  name: 'Puppet',
  pp: 12,
  xp: 8,
  affiliations: {
    solo: 'd6',
    buddy: 'd8',
    team: 'd10',
  },
  distinctions: [
    {
      name: 'Outsider Looking In',
      dice: 'd8',
    },
    {
      name: 'Whispers in My Head',
      dice: 'd8',
    },
    {
      name: 'Black and White World',
      dice: 'd8',
    },
  ],
  powerSets: [
    {
      name: 'Invisible Strings',
      powers: [
        { name: 'Leaping', dice: ['d6'] },
        { name: 'Object Sense', dice: ['d8'] },
        { name: 'Throwing', dice: ['d8'] },
        { name: 'Telekinesis', dice: ['d10'] },
      ],
      sfx: [
        {
          name: 'Area Attack',
          description:
            'Target multiple opponents. For each additional target, add d6 to your pool and keep +1 effect.',
        },
        {
          name: 'Very Helpful, Very Safe',
          description:
            'When using Invisible Strings to create Assets, add a d6 and step up the effect die by one.',
        },
      ],
      limits: [
        {
          name: 'Fragile Control',
          description:
            'When an asset created by Invisible Strings is targeted, it is undefended unless you spend a PP.',
        },]
    },
  ],
  specialties: [
    { name: 'Menace Expert', dice: 'd8' },
    { name: 'Acrobatics Expert', dice: 'd8' },
  ],
  milestones: [
    {
      name: 'The Tangled Web',
      rewards: [
        {
          xp: 1,
          description:
            'when you follow advice from the voices that helps the team or advances a heroic goal.',
        },
        {
          xp: 3,
          description:
            'when you ask an embarrassing or overly personal question about a teammate\'s past, relationships, or secrets.',
        },
        {
          xp: 10,
          description: 'when you turn against those who gave you purpose.',
        },
      ],
    },
    {
      name: 'Found Family',
      rewards: [
        {
          xp: 1,
          description: 'when you give a thoughtful gift to a teammate',
        },
        {
          xp: 3,
          description: 'when you publicly defend a teammate\'s controversial decision',
        },
        {
          xp: 10,
          description: 'when you risk your life to save a teammate',
        },
      ],
    },
  ],
  stress: {
    physical: { current: 'd12', max: 'd12' },
    mental: { current: 'd8', max: 'd12' },
    emotional: { current: null, max: 'd12' },
  },
};

export const shadowStrike: Character = {
  name: 'Simian',
  pp: 1,
  xp: 0,
  affiliations: {
    solo: 'd8',
    buddy: 'd10',
    team: 'd6',
  },
  distinctions: [
    {
      name: 'Push through the Pain',
      dice: 'd8',
    },
    {
      name: 'Strongest Ape-like Human',
      dice: 'd8',
    },
    {
      name: 'Anything for her',
      dice: 'd8',
    },
  ],
  powerSets: [
    {
      name: 'Animal Traits - Gorilla Strength',
      powers: [
        { name: 'Ape God Strength', dice: ['d12'] },
        { name: 'Enhanced Durability', dice: ['d8'] },
      ],
      sfx: [
        {
          name: 'Area Attack',
          description: 'Target multiple opponents. For every additiona, target, add d6 and keep +1 effect die.',
        },
        {
          name: 'Versatile',
          description: 'Replace Gorilla Strength power with a 2d8 or a 3d6 on your next roll',
        },
      ],
      limits: [
        {
          name: 'Difficult Recovert',
          description: 'Add Enhanced Durability die to the opposing roll when others try to recover your physical stress'
        }
      ]
    },
  ],
  specialties: [
    { name: 'Menace Master', dice: 'd10' },
    { name: 'Combat Expert', dice: 'd8' },
    { name: 'Tech Expert', dice: 'd8' },
    { name: 'Vehicle Expert', dice: 'd8' },
    { name: 'Crime Expert', dice: 'd8' },
  ],
  milestones: [
    {
      name: 'Peace with the Beast',
      rewards: [
        { xp: 1, description: 'when your looks cause people distress' },
        { xp: 3, description: 'when a team memner listens to your venting' },
        { xp: 10, description: 'When you embrace your animal side and save someone' },
      ],
    },
  ],
  stress: {
    physical: { current: null, max: 'd12' },
    mental: { current: 'd6', max: 'd12' },
    emotional: { current: null, max: 'd12' },
  },
};

export const heroes: Character[] = [puppet, shadowStrike];
