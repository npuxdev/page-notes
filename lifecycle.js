(() => {
  // Tab-local UI state. Closing or leaving a tab never leaves a floating control.
  function create(onChange) {
    let state={engaged:false,minimized:false,picking:false};
    const change=patch=>{state={...state,...patch};onChange({...state});};
    return {
      get state(){return {...state};},
      open(){change({engaged:true,minimized:false,picking:false});},
      close(){change({engaged:false,minimized:false,picking:false});},
      leave(){change({engaged:false,minimized:false,picking:false});},
      minimize(){if(state.engaged)change({minimized:true});},
      select(on){if(state.engaged)change({picking:!!on});},
      escape(){if(state.picking)change({picking:false,minimized:false});else change({engaged:false,minimized:false,picking:false});}
    };
  }
  globalThis.PageNotesLifecycle={create};
})();
