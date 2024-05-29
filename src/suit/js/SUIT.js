/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
import {TapSearchPanel} from 'firefly/ui/tap/TapSearchRootPanel.jsx';
import {defaultTheme} from 'firefly/ui/ThemeSetup.js';
import React from 'react';
import {set} from 'lodash';

import {firefly} from 'firefly/Firefly.js';
import {
    makeDefImageSearchActions,
    makeDefTableSearchActions, makeDefTapSearchActions, makeExternalSearchActions
} from 'firefly/ui/DefaultSearchActions.js';
import {mergeObjectOnly, getRootURL} from 'firefly/util/WebUtil.js';
import {getTAPServices} from 'firefly/ui/tap/TapKnownServices.js';
import {getFireflyViewerWebApiCommands} from 'firefly/api/webApiCommands/ViewerWebApiCommands.js';
import './suit.css';
import {makeLsstClickToAction, makeLsstTapEntry, LSST_DP02_DC2, LSST_DP03_SSO} from './actions.jsx';
import {RubinLanding} from './RubinLanding.jsx';
import APP_ICON from '../html/images/rubin-favicon-transparent-45px.png';
import {makeDachsTapEntry, makeChandraTapEntry} from './actions.jsx';
import {makeWorldPt} from 'firefly/visualize/Point.js';

// import SUIT_ICO from 'html/images/rubin_logo_transparent-70.png';

const OTHER_CAT= 'Other archive searches';

const RUBIN= 'Rubin searches';
const NEXUS = "Nexus searches"
const LSST_DP02_DC2_IMAGES= LSST_DP02_DC2+'-images';
// const LSST_DP03_SSO_IMAGES=LSST_DP03_SSO+'-images';

/**
 * This entry point is customized for LSST suit.  Refer to FFEntryPoint.js for information on
 * what could be used in defaults.
 */
let props = {
    showUserInfo: true,
    appIcon: <img src={APP_ICON}/>,
    showViewsSwitch: true,
    menu: [
        {label: 'CfA Nexus Search', action: "Nexus-Proto", primary: true, category: NEXUS,
            title: 'Search CfA Nexus Prototype'},
        {label: 'CfA Nexus Detailed Search', action: "Nexus", primary: true, category: NEXUS,
            title: 'Search CSC 2.1 Sources'},
        {label: 'OIR Search', action: "OIR-TAP", primary: true, category: NEXUS,
            title: 'Search Infrared Spectra'},
        {label:'Generic TAP', action: 'TAPSearch', category: OTHER_CAT, primary: true},

        {label: 'HiPS and IRSA Images', action: 'ImageSelectDropDownCmd', category: OTHER_CAT},
        // {label: 'IRSA Images', action: 'ImageSelectDropDownCmd', category: OTHER_CAT},
        {label:'IRSA Catalogs', action: 'IrsaCatalog',  category:OTHER_CAT},
        {label:'NED Objects', action: 'ClassicNedSearchCmd', primary: false, category:OTHER_CAT},
        {label:'VO Cone Search', action: 'ClassicVOCatalogPanelCmd', primary: false, category: OTHER_CAT},

        {label: 'Upload', action: 'FileUploadDropDownCmd', primary:true}
    ],
    appTitle: 'Rubin Portal',
    landingPage: <RubinLanding/>,
    fileDropEventAction: 'FileUploadDropDownCmd',
    slotProps: set({}, 'banner.slotProps.icon.style', {margin: '3px 10px 0 10px'}),


    dropdownPanels: [
        <TapSearchPanel lockService={true} lockedServiceName={"CfA Nexus Search"} groupKey={"Nexus-Proto"}
                        lockObsCore={true} obsCoreLockTitle='Nexus via ObsTAP'
                        layout= {{width: '100%'}}
                        name={"Nexus-Proto"}/>,
        <TapSearchPanel lockService={true} lockedServiceName={"CfA Nexus Detailed Search"} groupKey={"Nexus"}
                        lockObsCore={false}
                        layout= {{width: '100%'}}
                        name={"Nexus"}/>,
        <TapSearchPanel lockService={true} lockedServiceName={"OIR Search"} groupKey={"OIR-TAP"}
                        lockObsCore={true} obsCoreLockTitle='OIR via ObsTAP'
                        layout= {{width: '100%'}}
                        name={"OIR-TAP"}/>,
    ],

};

// const LSST_TAP_LABEL= 'LSST DP0.2 DC2';

props = mergeObjectOnly(props, window.firefly?.app ?? {});


const tapServices = [
    makeDachsTapEntry(),
    makeChandraTapEntry(),
    ({
        label: "OIR Search",
        value: 'http://oirsa.cfa.harvard.edu:8080/tap',
        fovDeg: 0.1,
        centerWP: makeWorldPt(62, -37).toString(),
        hipsUrl: 'ivo://CDS/P/2MASS/color',
    }),
    ...getTAPServices(['IRSA', 'Gaia', 'CADC', 'MAST Images', 'GAVO', 'HSA', 'NED', 'NASA Exoplanet Archive'])
];


let options = {
    theme: {
        customized: () => ({
                ...defaultTheme(),
                fontFamily: {
                    display: 'Source Sans Pro, inter', // applies to `h1`–`h4`
                    body: 'Source Sans Pro, inter', // applies to `title-*` and `body-*`
                },
                DISABLED_colorSchemes: {
                    light: {
                      palette: {
                        primary: {
                          50: '#f8fafc',
                          100: '#f1f5f9',
                          200: '#e2e8f0',
                          300: '#cbd5e1',
                          400: '#94a3b8',
                          500: '#64748b',
                          600: '#475569',
                          700: '#334155',
                          800: '#1e293b',
                          900: '#0f172a'
                        }
                      }
                    },
                    dark: {
                      palette: {
                        primary: {
                          50: '#fafafa',
                          100: '#f4f4f5',
                          200: '#e4e4e7',
                          300: '#d4d4d8',
                          400: '#a1a1aa',
                          500: '#71717a',
                          600: '#52525b',
                          700: '#3f3f46',
                          800: '#27272a',
                          900: '#18181b'
                        }
                      }
                    }
                  }
            }
        )
    },
    multiTableSearchCmdOptions: [
        {id: 'irsacat', title: 'IRSA Catalogs'},
        {id: 'vocat'},
        {id: 'nedcat'}
    ],
    MenuItemKeys: {maskOverlay: true, imageSelect:false},
    RequireWebSocketUptime : true,
    imageTabs: ['fileUpload', 'url', '2mass', 'wise', 'sdss', 'msx', 'dss', 'iras'],
    irsaCatalogFilter: 'lsstFilter',
    catalogSpatialOp: 'polygonWhenPlotExist',
    image : {
        canCreateExtractionTable: true,
    },
    coverage : {
        hipsSourceURL : 'ivo://cxc.harvard.edu/P/cda/hips/allsky/rgb',
        // hipsSource360URL : 'https://cdaftp.cfa.harvard.edu/cxc-hips',
        fovDegFallOver: .00001, // small number will never show an image only a HiPS
        exclusiveHiPS: true
    },
    charts : {
        maxRowsForScatter: 20000,
    },
    tap : {
        services: tapServices,
        defaultMaxrec: 50000
    },
    tapObsCore: {
        enableObsCoreDownload: true, // enable for other obscore
    },
    hips: {
        readoutShowsPixel : true,
        hipsSources: 'cds',
        // defHipsSources: {source: 'cds', label: 'Featured'},
        // mergedListPriority: 'cds'
    },
    // workspace: {showOptions: true},
    /* eslint-disable quotes */
    targetPanelExampleRow1: [`'62, -37'`, `'60.4 -35.1'`, `'4h11m59s -32d51m59s equ j2000'`, `'239.2 -47.6 gal'`],
    targetPanelExampleRow2: [`'NGC 1532' (NB: DC2 is a simulated sky, so names are not useful)`],
    /* eslint-enable quotes */
    searchActions : [
        ...makeExternalSearchActions(),
        ...makeDefTableSearchActions(),
        ...makeDefTapSearchActions(),
        ...makeDefImageSearchActions(),
        ...makeLsstClickToAction(),
    ],
    searchActionsCmdMask: [
        'tableTapUpload',
        'nedRadius', 'simbadRadius', 'gotoSimbadRadius',
        'tableNed', 'tableSimbad', 'tableSimbadGoto', 'imageFits', 'tableHiPS',
        'tapRadius', 'tapArea', 'tableTapRadius',
        'imageFits', 'HiPS', 'lsstObsCoreTap', 'lsstTruthSummaryRadius', 'lsstTruthSummaryArea',
        'lsstObsCoreTapTable', 'lsstTruthSummaryRadiusTable'
    ],
};

options = mergeObjectOnly(options, window.firefly?.options ?? {});
firefly.bootstrap(props, options,
    getFireflyViewerWebApiCommands(undefined,
        [
            // {desc:LSST_DP02_DC2, name:LSST_DP02_DC2},
            // {desc:LSST_DP02_DC2_IMAGES, name:LSST_DP02_DC2_IMAGES},
            // {desc:LSST_DP03_SSO, name:LSST_DP03_SSO},
        ],
    ));
