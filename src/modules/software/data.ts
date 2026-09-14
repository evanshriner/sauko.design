export type SoftwareProject = Readonly<{
  id: string;
  name: string;
  category: 'Product' | 'Web design';
  descriptor: string;
  url: string;
  image: string;
  imageSrcSet: string;
  imageAlt: string;
  imagePosition: string;
}>;

const publicAssetBaseUrl = import.meta.env.BASE_URL;

export const softwareProjects: readonly SoftwareProject[] = [
  {
    id: 'kitless',
    name: 'Kitless',
    category: 'Product',
    descriptor: 'Meal planning app',
    url: 'https://kitlessmeals.com',
    image: `${publicAssetBaseUrl}images/software/kitless.jpg`,
    imageSrcSet: `${publicAssetBaseUrl}images/software/kitless-720.jpg 720w, ${publicAssetBaseUrl}images/software/kitless-960.jpg 960w, ${publicAssetBaseUrl}images/software/kitless.jpg 1440w`,
    imageAlt: 'Kitless website homepage',
    imagePosition: 'left top',
  },
  {
    id: 'plenum',
    name: 'PlenumOps',
    category: 'Product',
    descriptor: 'Operations software',
    url: 'https://plenumops.com',
    image: `${publicAssetBaseUrl}images/software/plenum.jpg`,
    imageSrcSet: `${publicAssetBaseUrl}images/software/plenum-720.jpg 720w, ${publicAssetBaseUrl}images/software/plenum-960.jpg 960w, ${publicAssetBaseUrl}images/software/plenum.jpg 1440w`,
    imageAlt: 'PlenumOps website homepage',
    imagePosition: 'left top',
  },
  {
    id: 'wgs',
    name: 'WGS Consulting',
    category: 'Web design',
    descriptor: 'Consulting practice',
    url: 'https://wshrinerconsulting.com',
    image: `${publicAssetBaseUrl}images/software/wgs.jpg`,
    imageSrcSet: `${publicAssetBaseUrl}images/software/wgs-720.jpg 720w, ${publicAssetBaseUrl}images/software/wgs-960.jpg 960w, ${publicAssetBaseUrl}images/software/wgs.jpg 1440w`,
    imageAlt: 'WGS Consulting website homepage',
    imagePosition: 'left top',
  },
  {
    id: 'davidcastillo',
    name: 'David Castillo Gallery',
    category: 'Web design',
    descriptor: 'Modern art gallery',
    url: 'https://davidcastillogallery.com/',
    image: `${publicAssetBaseUrl}images/software/wynwood.jpg`,
    imageSrcSet: `${publicAssetBaseUrl}images/software/wynwood-720.jpg 720w, ${publicAssetBaseUrl}images/software/wynwood-960.jpg 960w, ${publicAssetBaseUrl}images/software/wynwood.jpg 1440w`,
    imageAlt: 'David Castillo home page',
    imagePosition: 'center top',
  },
  {
    id: 'articles',
    name: 'ARTicles St. Pete',
    category: 'Web design',
    descriptor: 'Contemporary art gallery',
    url: 'https://www.articlesstpete.com',
    image: `${publicAssetBaseUrl}images/software/articles.jpg`,
    imageSrcSet: `${publicAssetBaseUrl}images/software/articles-720.jpg 720w, ${publicAssetBaseUrl}images/software/articles-960.jpg 960w, ${publicAssetBaseUrl}images/software/articles.jpg 1440w`,
    imageAlt: 'ARTicles St. Pete website homepage',
    imagePosition: 'center top',
  },
];
