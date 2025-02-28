// Define possible combinations and their results
const COMBINATIONS = [
    {
        inputs: ['deuterium', 'proton'],
        output: 'helium-3',
        description: 'Nuclear fusion of deuterium and a proton creates helium-3'
    },
    {
        inputs: ['hydrogen', 'hydrogen'],
        output: 'hydrogen-gas',
        description: 'Two hydrogen atoms form hydrogen gas (H₂)'
    },
    {
        inputs: ['proton', 'electron'],
        output: 'hydrogen',
        description: 'A proton and electron combine to form a hydrogen atom'
    },
    {
        inputs: ['hydrogen', 'neutron'],
        output: 'deuterium',
        description: 'Adding a neutron to hydrogen creates deuterium'
    },
    // New combinations for helium and first 10 elements
    {
        inputs: ['helium-3', 'neutron'],
        output: 'helium',
        description: 'Adding a neutron to helium-3 creates stable helium-4 (common helium)'
    },
    {
        inputs: ['hydrogen-gas', 'oxygen-gas'],
        output: 'water',
        description: '2H₂ + O₂ → 2H₂O: Hydrogen gas combines with oxygen gas to form water'
    },
    {
        inputs: ['oxygen', 'oxygen'],
        output: 'oxygen-gas',
        description: 'Two oxygen atoms combine to form oxygen gas (O₂)'
    },
    {
        inputs: ['nitrogen', 'nitrogen'],
        output: 'nitrogen-gas',
        description: 'Two nitrogen atoms combine to form nitrogen gas (N₂)'
    },
    {
        inputs: ['hydrogen', 'fluorine'],
        output: 'hydrogen-fluoride',
        description: 'Hydrogen combines with fluorine to form hydrogen fluoride (HF)'
    },
    {
        inputs: ['carbon', 'oxygen', 'oxygen'],
        output: 'carbon-dioxide',
        description: 'Carbon combines with two oxygen atoms to form carbon dioxide (CO₂)'
    },
    {
        inputs: ['hydrogen', 'hydrogen', 'oxygen'],
        output: 'water',
        description: 'Two hydrogen atoms combine with one oxygen atom to form water (H₂O)'
    },
    {
        inputs: ['nitrogen', 'hydrogen', 'hydrogen', 'hydrogen'],
        output: 'ammonia',
        description: 'One nitrogen atom combines with three hydrogen atoms to form ammonia (NH₃)'
    },
    {
        inputs: ['carbon', 'hydrogen', 'hydrogen', 'hydrogen', 'hydrogen'],
        output: 'methane',
        description: 'One carbon atom combines with four hydrogen atoms to form methane (CH₄)'
    },
    {
        inputs: ['sodium', 'chlorine'],
        output: 'salt',
        description: 'Sodium combines with chlorine to form table salt (NaCl)'
    },
    {
        inputs: ['hydrogen-gas', 'nitrogen-gas'],
        output: 'ammonia',
        description: '3H₂ + N₂ → 2NH₃: Hydrogen gas combines with nitrogen gas to form ammonia'
    },
    {
        inputs: ['lithium', 'hydrogen'],
        output: 'lithium-hydride',
        description: 'Lithium combines with hydrogen to form lithium hydride (LiH)'
    },
    {
        inputs: ['beryllium', 'hydrogen', 'hydrogen'],
        output: 'beryllium-hydride',
        description: 'Beryllium combines with two hydrogen atoms to form beryllium hydride (BeH₂)'
    },
    
    // Nuclear fusion reactions
    {
        inputs: ['hydrogen', 'hydrogen', 'hydrogen', 'hydrogen'],
        output: 'helium',
        description: 'Nuclear fusion of four hydrogen atoms creates helium and releases energy (stellar nucleosynthesis)'
    },
    {
        inputs: ['helium', 'helium', 'helium'],
        output: 'carbon',
        description: 'Triple-alpha process: three helium nuclei fuse to form carbon (occurs in stars)'
    },
    {
        inputs: ['carbon', 'helium'],
        output: 'oxygen',
        description: 'Carbon and helium fuse to create oxygen (stellar nucleosynthesis)'
    },
    {
        inputs: ['oxygen', 'helium'],
        output: 'neon',
        description: 'Oxygen and helium fuse to create neon (stellar nucleosynthesis)'
    },
    
    // Some additional interesting combinations
    {
        inputs: ['helium', 'neon'],
        output: 'fluorine',
        description: 'Under extreme conditions, helium and neon can interact to form fluorine'
    },
    {
        inputs: ['carbon', 'carbon'],
        output: 'boron',
        description: 'Carbon atoms can be rearranged under specific conditions to form boron'
    },
    {
        inputs: ['helium', 'lithium'],
        output: 'nitrogen',
        description: 'Helium and lithium can undergo nuclear reactions to produce nitrogen'
    },
    // Nuclear Decay reactions
    {
        inputs: ['uranium'],
        output: 'alpha-particle',
        description: 'Uranium undergoes alpha decay, emitting an alpha particle (2 protons and 2 neutrons)'
    },
    {
        inputs: ['alpha-particle'],
        output: 'helium',
        description: 'An alpha particle is essentially a helium nucleus (2 protons and 2 neutrons)'
    },
    {
        inputs: ['neutron'],
        output: 'beta-particle',
        description: 'A neutron can decay into a proton and an electron (beta particle)'
    },
    {
        inputs: ['beta-particle'],
        output: 'electron',
        description: 'A beta particle is essentially a high-energy electron'
    },
    {
        inputs: ['uranium', 'neutron'],
        output: 'uranium-235',
        description: 'Uranium bombarded with a neutron can form the uranium-235 isotope'
    },
    {
        inputs: ['uranium-235', 'neutron'],
        output: 'gamma-ray',
        description: 'Uranium-235 hit by a neutron undergoes fission, releasing gamma radiation'
    },
    {
        inputs: ['uranium-235', 'neutron', 'neutron'],
        output: 'plutonium-239',
        description: 'Uranium-235 can capture neutrons and through decay become plutonium-239'
    },
    {
        inputs: ['radium'],
        output: 'radon',
        description: 'Radium decays into radon gas through alpha decay'
    },
    {
        inputs: ['radon'],
        output: 'polonium',
        description: 'Radon decays into polonium through a series of radioactive decays'
    },
    {
        inputs: ['polonium'],
        output: 'lead',
        description: 'Polonium ultimately decays to stable lead through alpha decay'
    },
    {
        inputs: ['thorium', 'neutron', 'neutron'],
        output: 'uranium-235',
        description: 'Thorium can be converted to fissile uranium-235 through neutron bombardment'
    },
    {
        inputs: ['proton', 'proton', 'proton', 'proton', 'electron', 'electron'],
        output: 'alpha-particle',
        description: 'Four protons and two electrons can combine to form an alpha particle'
    },
    {
        inputs: ['uranium-238', 'neutron', 'neutron', 'neutron'],
        output: 'plutonium-239',
        description: 'Uranium-238 can absorb neutrons to form plutonium-239, which is used in nuclear weapons'
    },
    {
        inputs: ['uranium', 'neutron', 'neutron', 'neutron'],
        output: 'uranium-238',
        description: 'Uranium bombarded with multiple neutrons can form uranium-238'
    },
    {
        inputs: ['lead', 'alpha-particle'],
        output: 'polonium',
        description: 'Lead bombarded with alpha particles can transmute into polonium'
    },
    {
        inputs: ['bismuth', 'alpha-particle'],
        output: 'astatine',
        description: 'Bismuth bombarded with alpha particles can create astatine, the rarest naturally occurring element'
    },
    {
        inputs: ['plutonium'],
        output: 'uranium',
        description: 'Plutonium decays to uranium through alpha decay'
    },
    {
        inputs: ['gamma-ray', 'hydrogen'],
        output: 'neutron',
        description: 'Gamma radiation can knock neutrons free from hydrogen atoms'
    },
    {
        inputs: ['gamma-ray', 'beryllium'],
        output: 'neutron',
        description: 'Gamma rays hitting beryllium produce neutrons (a neutron source)'
    },
];

// Function to check if a combination exists
function checkCombination(elementIds) {
    // Sort the IDs to ensure consistent matching regardless of order
    const sortedIds = [...elementIds].sort();
    
    for (const combo of COMBINATIONS) {
        const comboInputs = [...combo.inputs].sort();
        
        // Check if arrays match
        if (sortedIds.length === comboInputs.length && 
            sortedIds.every((id, index) => id === comboInputs[index])) {
            return combo;
        }
    }
    
    return null; // No matching combination found
} 