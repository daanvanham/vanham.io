'use strict';

var status = require('hapi-status'),
	dummy = [
		{
			id: '123',
			path: '/dit-is-een-test',
			title: 'Dit is een test!',
			intro: 'Pork belly jowl sausage, corned beef pork drumstick pancetta tongue biltong shank t-bone hamburger cupim. Beef ribs picanha ground round jerky alcatra hamburger. Prosciutto pork flank corned beef strip steak, tail ham hock shank cupim venison hamburger kielbasa. Capicola pork belly shank leberkas jowl ham chicken short loin bacon flank sirloin alcatra biltong venison. Ribeye kielbasa pig, turducken spare ribs biltong turkey shoulder fatback tail landjaeger jerky. Jerky leberkas kevin ball tip t-bone bresaola venison pork loin brisket fatback. Sirloin boudin beef ribs drumstick, pork belly short ribs pancetta filet mignon.',
			content: '<p>Brisket jerky alcatra cupim frankfurter pig pastrami chicken turkey meatloaf pork belly shank shoulder drumstick. Drumstick biltong cow tenderloin short loin pork loin jowl hamburger flank spare ribs rump swine ribeye. Hamburger t-bone ham hock beef ribs alcatra meatloaf short ribs, porchetta picanha short loin doner jowl boudin. Sausage ground round doner pork chop beef tri-tip picanha shoulder shankle pancetta. Jerky pig biltong cow, beef tail sirloin capicola.</p><p>Drumstick venison jowl short ribs ground round ribeye. Pancetta shankle alcatra tri-tip, bacon rump beef ribs. Beef bresaola cow, rump venison drumstick pork loin kevin porchetta flank beef ribs andouille. Hamburger jowl beef fatback chuck shankle. Beef ribs chicken andouille pig. Alcatra ball tip kevin capicola tri-tip kielbasa shoulder pork. Short ribs tenderloin porchetta tail capicola frankfurter shank.</p>',
			created: '2015-10-01 18:00:00'
		},
		{
			id: '345',
			path: '/hier-is-er-nog-een',
			title: 'Hier is er nog een!',
			intro: 'Tenderloin jerky pancetta, spare ribs filet mignon prosciutto pastrami turkey boudin ham pork ham hock. Fatback prosciutto venison t-bone brisket meatball chicken pig biltong. Beef ribs tongue pastrami shank bacon ham hock kielbasa, fatback ball tip corned beef capicola pork chop flank strip steak pork. Turducken ball tip ham tenderloin andouille pastrami rump filet mignon cupim spare ribs. Cow ribeye landjaeger, venison pork belly beef ribs doner porchetta. Beef bresaola tri-tip spare ribs, prosciutto swine venison jerky jowl ham hock pork chop andouille meatloaf flank ground round. Pork chop turkey swine, pig picanha kevin pastrami capicola spare ribs.',
			content: '<p>Jowl cupim sausage, strip steak t-bone landjaeger shankle bacon drumstick doner shoulder. Venison swine ground round ball tip, brisket biltong frankfurter andouille short loin. Cow spare ribs ground round, pancetta meatball beef ribs tail rump t-bone tenderloin. Tail t-bone filet mignon tongue chuck, beef ribs ground round flank pancetta meatball leberkas strip steak tenderloin. Boudin leberkas short ribs capicola. Shoulder filet mignon short loin ham hock landjaeger rump tenderloin bresaola kevin prosciutto turducken tail short ribs cow.</p>',
			created: '2015-10-01 18:00:00'
		},
		{
			id: '567',
			path: '/tests-all-over-the-place',
			title: 'Tests all over the place!',
			intro: 'Tenderloin frankfurter meatball, tri-tip swine hamburger rump ball tip short loin salami flank boudin pork belly capicola. Jerky bresaola pancetta, pork belly ground round cupim leberkas shoulder picanha swine tongue porchetta. Doner leberkas pork loin meatloaf picanha beef ribs. Salami turducken tongue doner. Prosciutto fatback pancetta tongue, short ribs turducken jerky strip steak beef cow andouille porchetta meatball.',
			content: '<p>Meatloaf tri-tip kielbasa porchetta, sirloin drumstick bresaola pancetta jowl frankfurter biltong. Pig ball tip tail flank corned beef. Filet mignon drumstick landjaeger, beef ribs tenderloin bresaola corned beef. Sirloin tongue salami porchetta ribeye jowl jerky beef filet mignon meatball picanha shankle bacon. Tri-tip landjaeger t-bone pastrami bresaola biltong prosciutto ham.</p>',
			created: '2015-10-01 18:00:00'
		},
		{
			id: '789',
			path: '/and-yet-another',
			title: 'And yet another!',
			intro: 'Brisket strip steak drumstick flank filet mignon pig frankfurter bresaola ball tip. Shankle tail frankfurter salami doner ham hock chuck bresaola t-bone bacon hamburger short ribs pig. Ball tip ham kielbasa, short loin alcatra jerky pig turkey venison shankle doner sirloin. Brisket tenderloin t-bone alcatra, hamburger turkey sirloin shankle cupim.',
			content: '<p>Beef ribs rump ball tip drumstick, bresaola tail frankfurter chicken turkey porchetta filet mignon kielbasa shoulder fatback. Ham kielbasa short loin, cupim drumstick bresaola hamburger. Capicola frankfurter bresaola rump jerky kevin. Jowl chicken ham hock, pastrami venison andouille tongue chuck prosciutto biltong hamburger pork pork chop.</p>',
			created: '2015-10-01 18:00:00'
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
