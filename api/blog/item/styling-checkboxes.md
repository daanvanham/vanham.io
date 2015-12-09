_Note: For this solution we assume you have a `<label>` element right after the checkbox. If this is not your current situation you might need to add a different element (like `<span>`) and you can add all the styling for `label::before` to that element._

The basic HTML as we all know it. Just an ordinary checkbox with its corresponding label. I prefer not using `id` myself, so I would've wrapped the label around the input field. But since it's shorter we use this markup for now.

```html
<input type=checkbox id=checkbox />
<label for=checkbox>This is a label</label>
```

For the fake "checkbox" box we add a [pseudo element](https://developer.mozilla.org/en/docs/Web/CSS/Pseudo-elements) with `::before`. This way we can add styling for this box, without the need for an (obsolete) extra element in our HTML.

```css
label::before {
	content: '';
	display: inline-block;
	width: 20px;
	height: 20px;
	border: 1px solid #ccc;
}
```

Add the `checked` state to the `::before` so people can actually see the checkbox is now checked!

```css
input:checked + label::before {
	box-shadow: 0 0 0 3px white inset;
	background-color: green;
}
```

Adding a fake checkbox is useless when we still have the real checkbox in sight, so let's not forget to hide it. This could be accomplished in two ways. Some browsers don't like it when you just use `display: none`, so depending on the browser support you might have to hide it with `position: absolute` and an absurd position.

```css
input {
	position: absolute;
	left: -9999px;
}
```

The good samaritans as we are we should not forget to give the user some nice feedback and add this small CSS snippet so the user knows it can click on the label:

```css
label:hover {
	cursor: pointer;
}
```

And there you go, a nice, easily stylable checkbox! Don't forget to make it pretty though!

Of course there are many many other ways you could accomplish this. Wrap the label around the input and add an extra element on which you can apply the styling for `label::before` for example is one I would normally use to prevent the usage of the `id` attribute.
