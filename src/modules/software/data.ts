export type SoftwareProject = Readonly<{
  id: string;
  name: string;
  category: 'Product' | 'Web design';
  descriptor: string;
  url: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
}>;

export const softwareProjects: readonly SoftwareProject[] = [
  {
    id: 'kitless',
    name: 'Kitless',
    category: 'Product',
    descriptor: 'Meal planning app',
    url: 'https://kitlessmeals.com',
    image: '/images/software/kitless.png',
    imageAlt: 'Kitless website homepage',
    imagePosition: 'left top',
  },
  {
    id: 'plenum',
    name: 'PlenumOps',
    category: 'Product',
    descriptor: 'Operations software',
    url: 'https://plenumops.com',
    image: '/images/software/plenum.png',
    imageAlt: 'PlenumOps website homepage',
    imagePosition: 'left top',
  },
  {
    id: 'wgs',
    name: 'WGS Consulting',
    category: 'Web design',
    descriptor: 'Consulting practice',
    url: 'https://wshrinerconsulting.com',
    image: '/images/software/wgs.png',
    imageAlt: 'WGS Consulting website homepage',
    imagePosition: 'left top',
  },
  {
    id: 'wynwood',
    name: 'Wynwood Walls',
    category: 'Web design',
    descriptor: 'Street art museum',
    url: 'https://thewynwoodwalls.com',
    image: '/images/software/wynwood.png',
    imageAlt: 'Wynwood Walls website homepage',
    imagePosition: 'center top',
  },
  {
    id: 'articles',
    name: 'ARTicles St. Pete',
    category: 'Web design',
    descriptor: 'Contemporary art gallery',
    url: 'https://www.articlesstpete.com',
    image: '/images/software/articles.png',
    imageAlt: 'ARTicles St. Pete website homepage',
    imagePosition: 'center top',
  },
];
