/** Get extracts from list of Wikipedia page IDs. */

var request = require('request');
var async = require('async');
var fs = require('fs');

var OUT_FILE = "articles_with_categories.json";
var FOLDER = "labeled/";
var CATEGORIES = ["Games", "Media", "Medicine", "Music", "Politics", "Sports"];
var API_URL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&pageids=";
var labelToIds = {0: [19524456, 4645357, 2117549, 24764381, 15224418, 38712777, 43624521, 1028344, 39918250, 11086249, 1682153, 18493254, 33275966, 8432120, 45670641, 38934622, 1333194, 218644, 34824428, 44670999, 6353, 34012106, 1887818, 404061, 40803740, 11940857, 40159587, 39714343, 32790481, 42672417, 2230787, 26938744], 1: [27076177, 43593539, 37157394, 37219278, 32311715, 39911303, 36126832, 41330594, 44995999, 1834418, 27871624, 22579045, 41688065, 39169250, 27656504, 34696405, 12910436, 12365363, 24069777, 24139054, 41422278, 46371224, 18232649, 25992737, 45189024, 47252897, 42749994, 23976104, 38834390, 36217163, 37039441, 42693182, 12435010, 261376, 19513711, 42737359, 32450652, 41138015, 10414130, 12429494, 27098726, 39127157, 22542699, 37954866, 47711337, 37059088, 12192561, 22566758, 46992366, 42777550, 37260424, 33902744, 48300442, 12662059, 5826155, 12516254, 26764461], 2: [34456896, 19901524, 18669335, 7394305, 32656234, 41401804, 36366897, 136109, 3910982, 121139, 40872227, 36378181, 21813387, 35230547, 23816792, 37497344, 11918235, 36379497, 20990098, 624551, 36111629, 38864200, 121687, 30014622, 4848796, 41129505, 6183574, 34812640, 110358, 259656, 39705357, 41760849, 32945074, 37063349, 46835293, 31278632, 40864638, 40168908, 34410723, 25257808, 9408110, 16730582, 23582956, 115933, 37297065, 595447, 20195126, 37189149, 32657808, 34212910, 26073618, 3489959], 3: [40697128, 1747821, 12794855, 30995852, 31697067, 7935893, 47691713, 32453694, 41625577, 43965340, 14643838, 22609, 109519, 9225722, 43288985, 33502244, 14814517, 34885549, 41516687, 31326511, 20917500, 35763633, 28891204, 21026292, 22209310, 6283124, 11134273, 2450901, 23846314, 1753439, 9423626, 2182865, 1084096, 13435807, 6705230, 22678583, 305409, 7986997, 678729, 877586, 2808917, 6376769, 7776187, 5036734, 5582513, 20155107, 7507707, 19826391, 20965353, 1274616, 15028877, 39170383, 14355938, 9516938, 4366441, 3372582, 1449823, 36580034, 33202097, 9346215, 25563187, 18322111, 1385908, 43970141, 218156, 25484545, 4839678, 9630727, 10980624, 22265793, 2021494, 21658654, 25454823, 29551767, 20234614, 4228409, 630472, 21536141, 3274090, 36177241, 22625826, 38389244, 17682738, 30231740, 35390072, 4763373, 35410600, 34420992, 26926596, 15312546, 46871683, 30334544, 11237851, 4057209, 34468789, 31386611, 1080576, 37609876, 34187905, 34252431, 30314245, 36167375, 19007654, 24352566, 34117152, 12777993, 47957848, 15913781, 6824216, 1275514, 6730218, 13235190, 14391900, 37255989, 29247449, 22316101, 25157016, 27338465, 35818901, 28126321, 29452475, 3050507, 26340, 47320751, 21349865, 44480483, 2595495, 29378485, 23513282, 12467605, 21842501, 46708293, 40502882, 21459750, 14795939, 19317257, 39329295, 6727714, 23527570, 2676460, 5479293, 11403781, 39104579, 483813, 3290997, 21226161, 13064685, 24541423, 22638211, 5806582, 18511441, 4528712, 374489, 13612861, 11891085, 7426450, 39122766, 11799886, 22532716, 19262148, 34885, 20372690, 12346837, 181919, 22050177, 13946095, 21511400, 7378182, 14684782, 9517278, 9142897, 43907613, 10680974, 20153782, 29581874, 4154856, 42145707, 17327264, 12978205, 27601705, 15892639, 25934735, 25123709, 40110248, 41400543, 35323484, 4946658, 2303647, 23956339, 18670612, 10107406, 190996, 24618059, 32360563, 38747097, 33404089, 43478257, 30426128, 14991617, 2286769, 24129418, 3385261, 17807200, 1724990, 11967006, 23211679, 30600906, 25982393, 35843293, 40794190, 28961426, 38298570, 390067, 4104506, 584992, 26285592, 34376759, 9514354, 2565462, 5856473, 7013705, 8531566, 11602108, 14039877, 29580562, 188515, 25160151, 32375639, 2496735, 1513315, 30968139, 3401682, 3727683, 36810465, 2576711, 28011100, 27975775, 4528623, 32753122, 1369542, 13109806, 3047892, 31623681, 21895321, 5518177, 7824285, 371227, 14090863, 9989771, 5493639, 35287557, 42409365, 7128445, 25065229, 41600531], 4: [8937498, 6385820, 11017624, 22984410, 12041515, 954394, 31333430, 33553289, 2321566, 36693063, 1626722, 2895000, 26768677, 18063124, 41711403, 15122788, 31490941, 12709340, 845813, 20560191, 1099828, 3517464, 5948971, 27044715, 10107125, 10787462, 32621558, 44442757, 11435584, 3958271, 34933884, 15945421, 946203, 20593777, 44206120, 18900654, 69576, 13737974, 19362381, 26368793, 41458508, 47463359, 31389832, 1159825, 29572557, 22556943, 24823816, 5592355, 31365783, 23514792, 8803328, 1914493, 7546859, 32805151, 36616295, 11224654, 4927589, 36180150, 11843163, 23003536, 7722028, 21199596, 11774993, 17582987, 5490309, 31733267, 42119483, 41578269, 1915308, 3061974, 28824124, 5912410, 32263529, 34399139, 295196, 16279782, 752302, 417798, 21506010, 23978958, 23737712, 10880287, 5699876, 19568980, 27084042, 19001527, 28156955, 34237680, 18179482, 21813811, 1004503, 23572104, 5722682, 4124813, 28643297, 44993723, 21187782, 16844304, 41685629, 15932072, 8169176, 8211633, 36702073, 3630033, 33445263, 26235776, 8203687, 21178899, 572576, 11748819, 31217856, 9159356, 36587077, 9711394, 1968080, 20195201, 7912934, 456405, 26906190, 12017588], 5: [1058803, 38887156, 46634939, 14852245, 47702461, 47315042, 36499042, 2871002, 25356219, 44056039, 26391097, 2986191, 1363454, 20446582, 36010825, 46194200, 39935733, 7138579, 44601131, 10382220, 30881477, 9855705, 1263537, 296008, 30319352, 43974714, 34839988, 39022872, 28788224, 7579188, 31442840, 1398763, 15444087, 22562491, 47829477, 44160600, 18977261, 14137563, 4135065, 12686512, 24144023, 8713178, 20949488, 15917215, 48208898, 40766374, 46385696, 39830149, 46884818, 6794815, 14362155, 34814579], 6: [20282125, 46864642, 14636948, 28809805, 17905216, 40096569, 36663268, 33842037, 33160858, 17937964, 42359271, 200289, 1794777, 3767564, 10395423, 38039986, 33282030, 14579046, 37602512, 16908188, 21044110, 38959827, 40045506, 39013011, 18810268, 26468505, 45185145, 2381667, 7560091, 15889702, 24177196, 33009617, 20928336, 15790152, 33138668, 15702516, 15414726, 21081494, 17244056, 32399984, 46188570, 14809929, 23844946, 33891895, 15498927, 15727524, 23412279, 15914281, 25541219, 47009324, 20853257, 15913855, 11836609, 15911608, 39774698, 4211865, 37027360, 13384564, 28533343, 36493875, 31655419, 36703843, 18511095, 13832292, 32015219, 38594647, 9065059, 27459614, 32294218, 47255075, 6012704, 45644710, 15685047, 4892765], 7: [11579157, 6801751, 196662, 11583840, 1509535, 22238223, 37889244, 47758247, 35204545, 28083728, 46197727, 46877779, 28912899, 24390415, 6628251, 28636650, 14737321, 23982871, 34262678, 43016857, 41265682, 28751934, 15528316, 1882999, 17337969, 12663222, 7447435, 5071119, 34240604, 3033523, 14860588, 7970864, 11205850, 1481077, 6464171, 15005611, 47404994, 16875345, 39442733, 3778528, 26213089, 4944359, 37477479, 11914479, 38117398, 5573365, 18308645, 35863616, 2308732, 4552001, 20120607, 16435078, 18304581, 30675395, 36635048, 35811924, 2595795, 10568855, 25366370, 3473928, 14863525, 28745353, 26595012, 6937981, 2193139, 41434704, 986994, 35339055, 23790637, 1057284, 4518501, 37337102, 12702274, 34858298, 5464478, 29728920, 8822532, 5770897, 2177497, 27291804, 5115471, 455994, 43964036, 34216643, 40464537, 35742612, 23588226, 26207792, 40788059, 42530062, 12406021, 33702163, 14975910, 14790671, 20274234, 41082022, 28586347, 14107885, 39124885, 40070121, 7978256, 11724495, 47803881, 23055371, 34481122, 19325983, 10406997, 3490482, 320307, 31900661, 29071122, 18121445, 14366041, 12112383, 45256047, 35091297, 40769901, 22094358, 11579762, 31303758, 39799116, 30916123, 11198227, 34478189, 30643733, 31621923, 11692019, 30965070, 15177250, 43313311, 38617110, 13760378, 5656559, 27074878, 2053, 6524155, 27632337, 10365949, 29451566, 16166890, 37716276, 400659, 36451744, 8206827, 2749882, 23662173, 34237791, 30227603, 36159461, 5361730, 37539216], 8: [6039623, 17475498, 10304230, 29650192, 26740495, 11113995, 90122, 25095497, 42343823, 10289104, 1098410, 398678, 6059297, 19928373, 21418402, 18553464, 31548891, 6951752, 31237994, 26832607, 43074358, 3651364, 31844801, 33876430, 36386483, 19009060, 1886604, 26013579, 47146583, 2447331, 11287656, 17888807, 6100707, 32912164, 22160671, 11583337, 20230460, 8820956, 33942531, 10383538, 36987652, 29540854, 5499705, 1677094, 21535023, 15553627, 19353046, 5710050, 12682883, 5292415, 20372624, 38816081, 34990677, 31647156, 7006378, 34255514, 18557745, 35152083, 45201311, 1249488, 19856709, 25057549, 7911683, 33305002, 23303696, 10894216, 6309562, 47404042, 27019020, 44989803, 3722970, 5033735, 27418195, 521855, 26672650, 42938228, 25888701, 11406701, 3525799, 15500925, 9461357, 36803371, 19955356, 46511210, 34459836, 382271, 25356419, 47569199, 34976727, 6172175, 40189499, 4661048, 11264641, 43804757, 22985252, 3259031, 424740, 26087715, 37137895, 59791, 19188375, 44567512, 2253176, 2645238, 7012942, 19801624, 47490219, 6572687, 5664649, 4862186, 2840129, 2869843, 3679856, 5167892, 32243600, 32055785, 3443954, 20052281, 22623430, 15033867, 8734355, 7834055, 2237980, 10624957, 9793838, 35725420, 38098941, 47482429, 44972700, 43763465, 2296765, 222676, 32147643, 31373757, 36986907, 13630311, 29156913, 39412482, 37486176, 39812423, 24741308, 354300, 8927560, 1554565, 20854524, 33136632, 10255261, 25375335, 2033612, 42352871, 23558420, 3542077, 25344557, 42029667, 28139338, 26585936, 21326333, 30863185, 8837522, 8567778, 15498919, 611093, 34893849, 1400654, 5929926, 20229211, 1944342, 33494708, 30951411, 2160128, 41567747, 14978641, 7305561, 2993058, 28771328, 7076348, 25044467, 31034377, 1018267, 27911709, 2251804, 39308375, 45322474, 27236028, 4438808, 17265768, 28773513, 26738901, 32993836, 1303149, 9179827, 27841242, 31053345, 42011178, 16297604, 30863109, 15867956, 2321028, 23233168, 38327270, 2211021, 37135421, 23708750, 37120399, 30606568, 44048127, 39080766, 45159579]};

function filterData(data, id) {
    return data['query']['pages'][id]["extract"];
}

CATEGORIES.forEach(function(category) {
    var dir = FOLDER + category + "/";

    fs.readdir(dir, function (err, files) {
        files.forEach(function (file) {
            fs.readFile(dir + file, 'utf-8', function (err, contents) {
                var obj = JSON.parse(contents);
                var pages = obj['query']['categorymembers'];
                var pageIds = pages.map(function (page) { return page['pageid']; });

                writeJSON(category, pageIds);
            });
        });
    });
});

function writeJSON(category, pageIds) {
    console.log("Working on category: " + category);

    async.eachSeries(pageIds, function (pageId, cb) {
        var url = API_URL + pageId;

        console.log(url);

        request(url, function (err, res, body) {
            try {
                var data = JSON.parse(body);
                var filteredData = data['query'];
                filteredData['pages'][pageId]['category'] = category;

                fs.appendFileSync(OUT_FILE, JSON.stringify(filteredData) + "\n", 'utf8');
            } catch (e) {
            }
            cb();
        });
    }, function done() {
        console.log("Done!");
    });
}
