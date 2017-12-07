import _ from 'lodash';
import { categories } from './categories';
import { rubriques } from './rubriques';

export const reducer = function(state,action){
  //console.log(action);
  if(action.type == "YAML_UPDATE"){
    state.obj = action.obj;
    state.misc.rubriques.map((o)=>(o.selected=false));
    state.misc.categories.map((o)=>(o.selected=false));
    state.misc.uncontrolledKeywords = [];
    state = decompileKeywords(state);
    state = compileKeywords(state);
    return state;
  }
  if(action.type == "JS_UPDATE"){
    state.obj = action.obj;
    state.misc.rubriques.map((o)=>(o.selected=false));
    state.misc.categories.map((o)=>(o.selected=false));
    state.misc.uncontrolledKeywords = [];
    state = compileKeywords(state);
    return state;
  }
  if(action.type == "FORM_UPDATE"){
    _.set(state.obj, action.target, action.value);
    return state;
  }
  if(action.type == "MISC_UPDATE"){
    _.set(state.misc, action.target, action.value);
    state = compileKeywords(state);
    return state;
  }
  return state;
};

function decompileKeywords(state){
  //get all the typeArticle
  let typeArticle = state.obj.typeArticle;
  let toEnable = typeArticle.map((a)=>(state.misc.rubriques.map((c)=>(c.label)).indexOf(a)));
  for(let i=0;i<toEnable.length;i++){
    if(toEnable[i] > -1){
      state.misc.rubriques[toEnable[i]].selected = true;
    }
  }

  //get all the controlled keywords
  let controlledKeywords = state.obj.controlledKeywords;
  let toSelect = controlledKeywords.map((a)=>(state.misc.categories.map((c)=>(c.label)).indexOf(a.label)));
  for(let i=0;i<toSelect.length;i++){
    if(toSelect[i] > -1){
      state.misc.categories[toSelect[i]].selected = true;
    }
  }


  //get all the uncontrolledKeywords
  let keyword_fr = state.obj.keyword_fr.split(',');
  for(let i=0;i<keyword_fr.length;i++){
    console.log(keyword_fr);
    state.misc.uncontrolledKeywords.push({label:keyword_fr[i]});
  }


  return state;
}


function compileKeywords(state){
  //Compute selected controlled keywords
  let rubriques = state.misc.rubriques.filter(function(rubrique){
    return rubrique.selected === true;
  });
  state.obj.typeArticle = rubriques.map((r)=>(r.label));

  //compute typeArticle
  let categories = state.misc.categories.filter(function(category){
    return category.selected === true;
  });
  state.misc.controlledKeywords = categories;
  state.obj.controlledKeywords = categories.map((o)=>(Object.assign({},o))).map(function(o){delete o.selected;return o;});

  //Compute uncontrolledKeywords
  let keyword_fr = [];
  for(let i=0;i<state.misc.uncontrolledKeywords.length;i++){
    keyword_fr.push(state.misc.uncontrolledKeywords[i].label);
  }
  if(keyword_fr.length > 0){
    state.obj.keywords_fr = keyword_fr.join(',');
  }
  //console.log("update keywords");
  return state;
}