"use strict";

var _ = require('underscore'),
    React = require('react'),
    Vis = require('./Vis.js'),
    Controls = require('./Controls');

var Mixer = React.createClass({
  render: function() {
    let createVisProps = (vis) => {
      return {
        path: ["cinder", vis],
        actions: this.props.actions,
        data: _.extend({choices: this.props.data.cinder.choices}, this.props.data.cinder[vis])
      };
    };

    var visAProps = createVisProps("visA");
    var visBProps = createVisProps("visB");
    var controlsProps = {
      path: ["cinder", "mix", "controls"],
      actions: this.props.actions,
      data: this.props.data.cinder.mix
    };

    return(
        <div className="mixer">
            <Vis key={"visA"} {...visAProps} />
            <MixerControls key={"controls"} {...controlsProps} />
            <Vis key={"visB"} {...visBProps} />
        </div>
    );
  }
});

var MixerControls = React.createClass({
  render: function() {
    let controlNodes = _.values(_.mapObject(this.props.data.controls, (control, name) => {
      let path = this.props.path.concat([name, "value"]);
      let onChange = _.partial(this.props.actions.onChange, path);
      let props = _.extend({key:path.join('.')}, control);

      switch(control.type) {
      case 'f':
        props = _.extend(props, {onChange: onChange});
        return (<Controls.Slider {...props} />);
      case 'b':
        let onBoolChange = _.compose(onChange, function(value){ return value ? 1 : 0; });
        props = _.extend(props, {onChange: onBoolChange});
        return (<Controls.Toggle {...props} />);
      }
    }));
    let playQueue =
          _.wrap(this.props.actions.playQueue, function(func, e){ e.preventDefault(); func();});
    return(
        <div className="controls">
        <Controls.Toggle onChange={this.props.actions.toggleCueing} name={"Cue"}
            value={this.props.data.cueing}/>
        <div className="toggle" onClick={playQueue}><a href="#">{"Play"}</a></div>
        {controlNodes}
        </div>
    )
  }
})

module.exports = Mixer;
