import '../sass/style.scss';

import ajaxHeart from './modules/heart';
import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';

autocomplete($('#address'), $('#lat'), $("#lng"));

typeAhead($('.search'));

makeMap($("#map"));

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);