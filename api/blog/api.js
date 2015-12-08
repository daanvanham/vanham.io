'use strict';

var status = require('hapi-status'),
	mongoose = require('mongoose'),
	dummy = [
		{
			id: 'mjouv9o3bl61',
			path: '/styling-checkboxes',
			title: 'Styling checkboxes',
			intro: 'An easy yet not uncommon task the most of us have to deal with is the styling of form elements. In this small post I\'ll show you one of the many possible ways to accomplish this in a clean way.',
			content: '<i>Note: For this solution we assume you have a <code>&lt;label&gt;</code> element right after the checkbox. If this is not your current situation you might need to add a different element (like <code>&lt;span&gt;</code>) and you can add all the styling for <code>label::before</code> to that element.</i></p><p>The basic HTML as we all know it. Just an ordinary checkbox with its corresponding label. I prefer not using <code>id</code> myself, so I would\'ve wrapped the label around the input field. But since it\'s shorter we use this markup for now.</p><div class="full-block"><div class="wrapper -code"><code data-type="html">&lt;input type=checkbox id=checkbox /&gt;<br />&lt;label for=checkbox&gt;This is a label&lt;/label&gt;</code></div></div><p>For the fake "checkbox" box we add a <a href="https://developer.mozilla.org/en/docs/Web/CSS/Pseudo-elements" target="_blank">pseudo element</a> with <code>::before</code>. This way we can add styling for this box, without the need for an (obsolete) extra element in our HTML.</p><div class="full-block"><div class="wrapper -code"><code data-type="css">label::before {<br />&nbsp;content: \'\';<br />&nbsp;&nbsp;display: inline-block;<br />&nbsp;&nbsp;width: 20px;<br />&nbsp;&nbsp;height: 20px;<br />&nbsp;&nbsp;border: 1px solid #ccc;<br />}</code></div></div><p>Add the <code>checked</code> state to the <code>::after</code> so people can actually see the checkbox is now checked!</p><div class="full-block"><div class="wrapper -code"><code data-type="css">input:checked + label::before {<br />&nbsp;&nbsp;box-shadow: 0 0 0 3px white inset;<br />&nbsp;&nbsp;background-color: green;<br />}</code></div></div><p>Adding a fake checkbox is useless when we still have the real checkbox in sight, so let\'s not forget to hide it. This could be accomplished in two ways. Some browsers don\'t like it when you just use <code>display: none</code>, so depending on the browser support</p><div class="full-block"><div class="wrapper -code"><code data-type="css">input {<br />&nbsp;&nbsp;display: none;<br />}</code></div></div><p>The good samaritans as we are we should not forget to give the user some nice feedback and add this small CSS snippet so the user knows it can click on the label:</p><div class="full-block"><div class="wrapper -code"><code data-type="css">label:hover {<br />&nbsp;&nbsp;cursor: pointer;<br />}</code></div></div><p>And there you go, a nice, easily styled checkbox!</p><p>Of course there are many many other ways you could accomplish this. Wrap the label around the input and add an extra element on which you can apply the styling for <code>label::before</code> for example is one I would normally use to prevent the usage of the <code>id</code> attribute.</p>',
			created: '2015-12-08 23:37:43'
		}
	].reverse();

function API() {
	var api = this;

	api.index = function index(request, reply) {
		return status.ok(reply, dummy);
	};

	api.fetch = function fetch(request, reply) {
		var result;
		dummy.forEach(function(item) {
			if (item.id === request.params.id) {
				result = item;
			}
		});

		return status.ok(reply, result);
	};
}

module.exports = new API();
