import type { Slug } from "@/types";

/**
 * Typed service-area index content keyed by location slug. Each entry lists
 * what the reference's `/<location>/service-area/` page actually publishes:
 * an intro paragraph, a counties block and compass-direction city buckets.
 *
 * Only pairs listed here render a completed service-area index page; the
 * rest keep the Sprint 1 scaffold. `hasLocationCapability(..., "hasServiceAreaIndex")`
 * in `src/data/availability.ts` still gates whether the route mounts at all.
 */

export interface ServiceAreaEntry { name: string; slug: Slug }
export interface ServiceAreaDirection {
  heading: "North" | "South" | "East" | "West";
  cities: ServiceAreaEntry[];
}
export interface ServiceAreaContent {
  intro: string;
  regionalHeading: string;
  counties: ServiceAreaEntry[];
  zips?: string[];
  directions: ServiceAreaDirection[];
}

const serviceAreas: Record<Slug, ServiceAreaContent> = {
  nashville: {
    intro:
      "Mr. Roof proudly serves Nashville, Murfreesboro, Clarksville and the surrounding Middle Tennessee communities.",
    regionalHeading: "Serving Nashville, Tennessee and The Surrounding Areas",
    counties: [
      { name: "Davidson County", slug: "davidson-county" },
      { name: "Cheatham County", slug: "cheatham-county" },
      { name: "Williamson County", slug: "williamson-county" },
    ],
    directions: [
      { heading: "North", cities: [
        { name: "Gallatin", slug: "gallatin" },
        { name: "Hendersonville", slug: "hendersonville" },
        { name: "Madison", slug: "madison" },
        { name: "Portland", slug: "portland" },
      ]},
      { heading: "South", cities: [
        { name: "Brentwood", slug: "brentwood" },
        { name: "Franklin", slug: "franklin" },
        { name: "La Vernge", slug: "la-vernge" },
        { name: "Murfreesboro", slug: "murfreesboro" },
        { name: "Spring Hill", slug: "spring-hill" },
      ]},
      { heading: "East", cities: [
        { name: "Antioch", slug: "antioch" },
        { name: "Hermitage", slug: "hermitage" },
        { name: "Lebanon", slug: "lebanon" },
        { name: "Mount Juliet", slug: "mount-juliet" },
        { name: "Smyrna", slug: "smyrna" },
      ]},
      { heading: "West", cities: [
        { name: "Clarksville", slug: "clarksville" },
      ]},
    ],
  },
  cincinnati: {
    intro:
      "Mr. Roof has served Cincinnati and the surrounding Tri-State area with residential exterior services since 1962.",
    regionalHeading: "Serving Cincinnati and The Surrounding Areas",
    counties: [
      { name: "Hamilton County", slug: "hamilton-county" },
      { name: "Clermont County", slug: "clermont-county" },
      { name: "Butler County", slug: "butler-county" },
      { name: "Kenton County", slug: "kenton-county" },
      { name: "Warren County", slug: "warren-county" },
    ],
    directions: [
      { heading: "North", cities: [
        { name: "Mason", slug: "mason" },
        { name: "Middletown", slug: "middletown" },
        { name: "West Chester", slug: "west-chester" },
      ]},
      { heading: "South", cities: [
        { name: "Covington, KY", slug: "covington" },
        { name: "Florence, KY", slug: "florence" },
      ]},
      { heading: "East", cities: [
        { name: "Batavia", slug: "batavia" },
        { name: "Loveland", slug: "loveland" },
        { name: "Milford", slug: "milford" },
      ]},
      { heading: "West", cities: [
        { name: "Fairfield", slug: "fairfield" },
        { name: "Hamilton", slug: "hamilton" },
        { name: "Liberty Township", slug: "liberty-township" },
      ]},
    ],
  },
  cleveland: {
    intro:
      "Mr. Roof has served Cleveland, Akron and the surrounding Northeast Ohio communities with residential exterior services.",
    regionalHeading: "Serving Cleveland, Akron and The Surrounding Areas",
    counties: [
      { name: "Cuyahoga County", slug: "cuyahoga-county" },
      { name: "Geauga County", slug: "geauga-county" },
      { name: "Lake County", slug: "lake-county" },
      { name: "Lorain County", slug: "lorain-county" },
      { name: "Medina County", slug: "medina" },
      { name: "Summit County", slug: "summit-county" },
      { name: "Stark County", slug: "stark-county" },
    ],
    directions: [
      { heading: "North", cities: [
        { name: "Avon Lake", slug: "avon-lake" },
        { name: "Bay Village", slug: "bay-village" },
        { name: "Euclid", slug: "euclid" },
        { name: "Lakewood", slug: "lakewood" },
        { name: "Mansfield", slug: "mansfield" },
        { name: "North Olmstead", slug: "north-olmstead" },
        { name: "North Ridgeville", slug: "north-ridgeville" },
      ]},
      { heading: "South", cities: [
        { name: "Akron", slug: "akron" },
        { name: "Canton", slug: "canton" },
        { name: "Independence", slug: "independence" },
        { name: "Medina", slug: "medina" },
        { name: "North Royalton", slug: "north-royalton" },
      ]},
      { heading: "East", cities: [
        { name: "Aurora", slug: "aurora" },
        { name: "Brecksville", slug: "brecksville" },
        { name: "Eastlake", slug: "eastlake" },
        { name: "Hudson", slug: "hudson" },
        { name: "Mentor", slug: "mentor" },
        { name: "Painesville", slug: "painesville" },
        { name: "Solon", slug: "solon" },
        { name: "Willoughby", slug: "willoughby" },
      ]},
      { heading: "West", cities: [
        { name: "Brunswick", slug: "brunswick" },
        { name: "Elyria", slug: "elyria" },
        { name: "Parma", slug: "parma" },
        { name: "Rocky River", slug: "rocky-river" },
        { name: "Strongsville", slug: "strongsville" },
        { name: "Westlake", slug: "westlake" },
      ]},
    ],
  },
  "grand-rapids": {
    intro:
      "Mr. Roof serves Grand Rapids and the surrounding West Michigan communities with residential exterior services.",
    regionalHeading: "Serving Grand Rapids and The Surrounding Areas",
    counties: [
      { name: "Kent County", slug: "kent-county" },
      { name: "Barry County", slug: "barry-county" },
      { name: "Ottawa County", slug: "ottawa-county" },
      { name: "Montcalm County", slug: "montcalm-county" },
      { name: "Kalamazoo County", slug: "kalamazoo" },
    ],
    directions: [
      { heading: "North", cities: [
        { name: "Cedar Springs", slug: "cedar-springs" },
        { name: "Comstock Park", slug: "comstock-park" },
        { name: "Coopersville", slug: "coopersville" },
        { name: "Kentwood", slug: "kentwood" },
        { name: "Muskegon", slug: "muskegon" },
        { name: "Sparta", slug: "sparta" },
        { name: "Wyoming", slug: "wyoming" },
      ]},
      { heading: "South", cities: [
        { name: "Byron Center", slug: "byron-center" },
        { name: "Cutlerville", slug: "cutlerville" },
        { name: "Georgetown", slug: "georgetown" },
        { name: "Grandville", slug: "grandville" },
        { name: "Kalamazoo", slug: "kalamazoo" },
        { name: "Portage", slug: "portage" },
      ]},
      { heading: "East", cities: [
        { name: "Ada", slug: "ada" },
        { name: "Battle Creek", slug: "battle-creek" },
        { name: "Caledonia", slug: "caledonia" },
        { name: "Forest Hills", slug: "forest-hills" },
        { name: "Lowell", slug: "lowell" },
      ]},
      { heading: "West", cities: [
        { name: "Allendale", slug: "allendale" },
        { name: "Ferrysburg", slug: "ferrysburg" },
        { name: "Grand Haven", slug: "grand-haven" },
        { name: "Holland", slug: "holland" },
        { name: "Hudsonville", slug: "hudsonville" },
        { name: "Spring Lake", slug: "spring-lake" },
        { name: "Zeeland", slug: "zeeland" },
      ]},
    ],
  },
  "ann-arbor": {
    intro:
      "Mr. Roof is proud to provide our services to Southeast Michigan homeowners, from Ann Arbor to the surrounding counties.",
    regionalHeading: "Serving Southeast Michigan and The Surrounding Areas",
    counties: [
      { name: "Jackson County", slug: "jackson-county" },
      { name: "Lenawee County", slug: "lenawee-county" },
      { name: "Livingston County", slug: "livingston-county" },
      { name: "Monroe County", slug: "monroe-county" },
      { name: "Oakland County", slug: "oakland-county" },
      { name: "Washtenaw County", slug: "washtenaw-county" },
      { name: "Wayne County", slug: "wayne-county" },
    ],
    directions: [
      { heading: "North", cities: [
        { name: "Bloomfield Hills", slug: "bloomfield-hills" },
        { name: "Commerce Township", slug: "commerce-township" },
        { name: "Farmington Hills", slug: "farmington-hills" },
        { name: "Novi", slug: "novi" },
        { name: "Royal Oaks", slug: "royal-oaks" },
        { name: "Southfield", slug: "southfield" },
        { name: "Sterling Heights", slug: "sterling-heights" },
        { name: "Troy", slug: "troy" },
        { name: "Warren", slug: "warren" },
        { name: "Waterford", slug: "waterford" },
        { name: "West Bloomfield", slug: "west-bloomfield" },
      ]},
      { heading: "South", cities: [
        { name: "Adrian", slug: "adrian" },
        { name: "Belleville", slug: "belleville" },
        { name: "Milan", slug: "milan" },
        { name: "Saline", slug: "saline" },
        { name: "Taylor", slug: "taylor" },
        { name: "Tecumseh", slug: "tecumseh" },
        { name: "Temperance", slug: "temperance" },
        { name: "Toledo, OH", slug: "toledo" },
        { name: "Ypsilanti", slug: "ypsilanti" },
      ]},
      { heading: "East", cities: [
        { name: "Beverly Hills", slug: "beverly-hills" },
        { name: "Canton", slug: "canton" },
        { name: "Clinton Township", slug: "clinton-township" },
        { name: "Dearborn", slug: "dearborn" },
        { name: "Detroit", slug: "detroit" },
        { name: "Inkster", slug: "inkster" },
        { name: "Lincoln Park", slug: "lincoln-park" },
        { name: "Livonia", slug: "livonia" },
        { name: "Northville", slug: "northville" },
        { name: "Plymouth", slug: "plymouth" },
        { name: "Redford", slug: "redford" },
        { name: "Romulus", slug: "romulus" },
        { name: "Roseville", slug: "roseville" },
        { name: "St. Clair Shores", slug: "st-clair-shores" },
        { name: "Westland", slug: "westland" },
        { name: "Wyandotte", slug: "wyandotte" },
      ]},
      { heading: "West", cities: [
        { name: "Brighton", slug: "brighton" },
        { name: "Dexter", slug: "dexter" },
        { name: "Howell", slug: "howell" },
        { name: "Milford", slug: "milford" },
        { name: "Pinckney", slug: "pinckney" },
        { name: "South Lyon", slug: "south-lyon" },
        { name: "Whitmore Lake", slug: "whitmore-lake" },
      ]},
    ],
  },
  lansing: {
    // The reference /lansing/service-area/ is a full feature page rather
    // than a flat index. We extract just the community-list portion here;
    // the richer page sections (why-choose-us, process, projects, reviews,
    // financing, FAQ, closing estimate) are deferred to a later sprint.
    intro:
      "Mr. Roof serves Lansing and the surrounding mid-Michigan communities with residential exterior services.",
    regionalHeading: "Serving Lansing and The Surrounding Areas",
    counties: [],
    directions: [
      { heading: "North", cities: [
        { name: "DeWitt", slug: "dewitt" },
      ]},
      { heading: "East", cities: [
        { name: "East Lansing", slug: "east-lansing" },
        { name: "Haslett", slug: "haslett" },
        { name: "Okemos", slug: "okemos" },
      ]},
      { heading: "South", cities: [
        { name: "Holt", slug: "holt" },
      ]},
      { heading: "West", cities: [
        { name: "Waverly", slug: "waverly" },
      ]},
    ],
  },
};

export function findServiceArea(slug: Slug): ServiceAreaContent | undefined {
  return serviceAreas[slug];
}

export const completedServiceAreaSlugs: Slug[] = Object.keys(serviceAreas);
