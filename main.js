function test_localstorage() {
	var test = 't';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

function comment_generator() {
	var comments = ['Photoshopped.', "'Shopped.", "Is this real?",
	'WHY ARE YOU ADDICTED TO FARMING VOTES ON +VOTE',
	"It's gonna be a tough month boys",
	"Screw <YEAR>!".replace("<YEAR>", (new Date().getFullYear().toString())),
	"Cool.",
	"Awesome.",
	"I feel like I've seen this somewhere before...",
	"Epstein did not kill himself.",
	"I",
	"F",
	"Wow. Self burn. Those are rare.",
	"Heck yes.",
	"If you can’t fart in the toilet where are you supposed to?",
	"LMFAOOO",
	"Dominance established.",
	"Yes as a general rule of thumb, keep your opinions about other people to yourself.",
	"This.",
	"Is air guitar a string instrument or a wind instrument?",
	"Random Cat Fact - Unlike dogs, cats do not have a sweet tooth. Scientists believe this is due to a mutation in a key taste receptor.",
	"Random Cat Fact - The technical term for a cat's hairball is a bezoar.",
	"Random Cat Fact - A cat can't climb head first down a tree because every claw on a cat’s paw points the same way. To get down from a tree, a cat must back down."];

	// Add the attribution
	for(var i = 0; i < comments.length; i++) {
		comments[i] = "<NAME>: " + comments[i];
	}

	var item = comments[Math.floor(Math.random() * comments.length)];
	return item;
}

function name_generator() {
	var names = ['Bellamy',
		'Charlie',
		'Dakota',
		'Denver',
		'Emerson',
		'Finley',
		'Justice',
		'River',
		'Skyler',
		'Tatum',
		'Avery',
		'Briar',
		'Brooklyn',
		'Campbell',
		'Dallas',
		'Gray',
		'Greer',
		'Haven',
		'Indigo',
		'Jordan',
		'Lennox',
		'Morgan',
		'Onyx',
		'Peyton',
		'Quinn',
		'Reese',
		'Riley',
		'Robin',
		'Rory',
		'Salem',
		'Sawyer',
		'Shae',
		'Shiloh',
		'Story',
		'Sutton',
		'Zion'];

	// TODO: Combine with last + middle names to make it easier to have a lot of names...

	var item = names[Math.floor(Math.random() * names.length)];

	var item2 = names[Math.floor(Math.random() * names.length)];
	while(item == item2) {
		item2 = names[Math.floor(Math.random() * names.length)];
	}

	return "<FIRST> <LAST>"
		.replace("<FIRST>", item)
		.replace("<LAST>", item2);
}

function check_history() {
	// Ensure we have an images array...
	var imgs = localStorage.getItem('imgs');
	if(!!imgs) {
		try {
			imgs = JSON.parse(imgs);
		} catch(e) {
			imgs = [];
		}
	} else {
		imgs = [];
	}
	localStorage.setItem('imgs', JSON.stringify(imgs));

	// Ensure we have a posts array...
	var posts = localStorage.getItem('posts');
	if(!!posts) {
		try {
			posts = JSON.parse(posts);
		} catch(e) {
			posts = [];
		}
	} else {
		posts = [];
	}
	localStorage.setItem('posts', JSON.stringify(posts));

	var followers = localStorage.getItem('followers');
	if(!!followers) {
		try {
			followers = JSON.parse(followers);
		} catch(e) {
			followers = [];
		}
	} else {
		followers = [];
	}

	// TODO: If followers empty, add some default followers...

	localStorage.setItem('followers', JSON.stringify(followers));

	// Ensure we have a username...
	var username = localStorage.getItem('username');
	if(!username) {
		username = 'user001';
	}
	localStorage.setItem('username', username);
}

function get_votes() {
	var posts = localStorage.getItem('posts');
	if(!!posts) {
		try {
			posts = JSON.parse(posts);
		} catch(e) {
			posts = [];
		}
	} else {
		posts = [];
	}

	// Count votes across posts...
	var score = 0;
	for(var i = 0; i < posts.length; i++) {
		// Allow for non-user posts...
		if(posts[i].poster == 'user') {
			score += posts[i].score;
		}
	}

	// Get number of followers to add to score...
	var followers = localStorage.getItem('followers');
	if(!!followers) {
		try {
			followers = JSON.parse(followers);
		} catch(e) {
			followers = [];
		}
	} else {
		followers = [];
	}

	// Return as an average + follower count...
	return ~~(score / posts.length) + followers.length;
}

function create_new_post(datauri, score) {
	var posts = localStorage.getItem('posts');
	if(!!posts) {
		try {
			posts = JSON.parse(posts);
		} catch(e) {
			posts = [];
		}
	} else {
		posts = [];
	}

	var imgs = localStorage.getItem('imgs');
	if(!!imgs) {
		try {
			imgs = JSON.parse(imgs);
		} catch(e) {
			imgs = [];
		}
	} else {
		imgs = [];
	}

	var followers = localStorage.getItem('followers');
	if(!!followers) {
		try {
			followers = JSON.parse(followers);
		} catch(e) {
			followers = [];
		}
	} else {
		followers = [];
	}

	// Deduplicate datauri if repost...
	var repost = false;
	var idx = 0;
	for(var i = 0; i < imgs.length; i++) {
		if(imgs[i] == datauri) {
			idx = i + 1;
			repost = true;
			break;
		}
	}

	if(repost == false) {
		// Add and get index
		idx = imgs.push(datauri);
	} else {
		// Punish reposting...
		score = ~~(score / 3);
	}

	// Minimum score...
	if(score < 1) {
		score = 1;
	}

	// Comments...
	var comments = [];
	var commenters = [];

	// Add complaint to comment if repost...
	if(repost == true) {
		var name_a = name_generator();
		var name_b = name_generator();

		commenters.push(name_a);
		commenters.push(name_b);

		comments.push("<NAME>: Ugh. Repost."
			.replace("<NAME>", name_a));
		comments.push("<NAME>: <OtherName> shutup! I haven't seen it."
			.replace("<NAME>", name_b)
			.replace("<OtherName>", name_a));
		comments.push("<NAME>: <NAME2>, really? Lol."
			.replace("<NAME>", name_a)
			.replace("<NAME2>", name_b));
	}

	var comment_length = score;
	if(comment_length > 8) {
		comment_length = 8;
	}

	var comment_bases = []
	for(var i = 0; i < comment_length; i++) {
		var val = comment_generator();
		var attempt = 0;

		// Don't repeat a comment...
		while(comment_bases.indexOf(val) >= 0) {
			val = comment_generator();
			attempt += 1;

			if(attempt > 10) {
				break;
			}
		}

		comment_bases.push(val);
	}

	// Add the attribution...
	for(var i = 0; i < comment_bases.length; i++) {
		var iname = name_generator();
		commenters.push(iname);
		comments.push(comment_bases[i].replace("<NAME>", iname));
	}

	// Get the post time
	var now = new Date();

	posts.push({"img": idx - 1,
		"score": score,
		"comments": comments,
		"poster": "user",
		"published": now,
		"commenters": commenters});

	// TODO: Check when setting if we've exceeded quota...

	localStorage.setItem('posts', JSON.stringify(posts));
	localStorage.setItem('imgs', JSON.stringify(imgs));

	// Regenerate timeline...
	update_timeline();

	// Update voteblock...
	var voteblock = document.getElementById('voteblock');
	voteblock.textContent = get_votes();

	// Check to see if we should add a follower...
	if(score > 10) {
		var val = name_generator();
		var attempt = 0;
		while(followers.indexOf(val) >= 0) {
			val = name_generator();
			attempt += 1;

			if(attempt > 10) {
				break;
			}
		}

		if(attempt < 10) {
			followers.push(val);
		}

		// TODO: Check when setting if we've exceeded quota...
		localStorage.setItem('followers', JSON.stringify(followers));
	}
}

function create_bot_post(name) {
	var posts = localStorage.getItem('posts');
	if(!!posts) {
		try {
			posts = JSON.parse(posts);
		} catch(e) {
			posts = [];
		}
	} else {
		posts = [];
	}

	var imgs = localStorage.getItem('imgs');
	if(!!imgs) {
		try {
			imgs = JSON.parse(imgs);
		} catch(e) {
			imgs = [];
		}
	} else {
		imgs = [];
	}

	// Choose random image from index
	var idx = Math.floor(Math.random() * imgs.length);

	var score = 1;
	for(var i = 0; i < posts.length; i++) {
		if(posts[i].img == idx) {
			score = ~~(posts[i].score / 2);
			break;
		}
	}

	// Get the post time
	var now = new Date();

	// TODO: Comments on bot posts...
	var comments = [];

	posts.push({"img": idx,
		"score": score,
		"comments": comments,
		"poster": name,
		"published": now,
		"commenters": []});

	// TODO: Check when setting if we've exceeded quota...

	localStorage.setItem('posts', JSON.stringify(posts));

	// Trigger regenerating timeline
	update_timeline();
}

function trigger_follower_post() {
	var followers = localStorage.getItem('followers');
	if(!!followers) {
		try {
			followers = JSON.parse(followers);
		} catch(e) {
			followers = [];
		}
	} else {
		followers = [];
	}

	if(followers.length > 0) {
		var name = followers[Math.floor(Math.random() * followers.length)];
		create_bot_post(name);
	}

	setTimeout(trigger_follower_post, (Math.random() * 3000) + 32000);
}

function update_timeline() {
	var timeline = document.getElementById('timeline');
	while(timeline.firstChild) {
    	timeline.removeChild(timeline.firstChild);
    }

	var posts = localStorage.getItem('posts');
	if(!!posts) {
		try {
			posts = JSON.parse(posts);
		} catch(e) {
			posts = [];
		}
	} else {
		posts = [];
	}

	var imgs = localStorage.getItem('imgs');
	if(!!imgs) {
		try {
			imgs = JSON.parse(imgs);
		} catch(e) {
			imgs = [];
		}
	} else {
		imgs = [];
	}

	// TODO: Animation...

	// TODO: Build post cards...
	for(var i = posts.length - 1; i >= 0; i--) {
		var child_el = document.createElement('li');
		child_el.classList.add('post_card');

		// Image
		var image_field = document.createElement('img');
		image_field.src = imgs[posts[i].img];
		child_el.appendChild(image_field);

		// Poster
		var attribution = document.createElement('p');
		if(posts[i].poster == 'user') {
			attribution.textContent = localStorage.getItem('username') ?? 'user001';
		} else {
			attribution.textContent = posts[i].poster;
		}
		child_el.appendChild(attribution);

		// Score
		var votes = document.createElement('p');
		votes.classList.add('votes');
		votes.textContent = posts[i].score;
		child_el.appendChild(votes);

		// Time
		var datefield = document.createElement('p');
		datefield.textContent = posts[i].published;
		child_el.appendChild(datefield);

		// TODO: Some sort of delete button...

		// Comments
		var comments = document.createElement('ul');
		comments.classList.add('comments');

		for(var ci = 0; ci < posts[i].comments.length; ci++) {
			var comment_field = document.createElement('li');
			comment_field.textContent = posts[i].comments[ci];

			comments.appendChild(comment_field);
		}

		child_el.appendChild(comments);

		// TODO: Reply field...

		timeline.appendChild(child_el);
	}
}

function create_ui() {
	var el = document.getElementById("app");

	// Clear the app...
	el.textContent = '';
	while(el.firstChild) {
    	el.removeChild(el.firstChild);
    }
    el.className = '';

    // TODO: Create top bar...
    var ui_bar = document.createElement('div');
    ui_bar.classList.add('ui_bar', 'animate__animated', 'animate__fadeInDown');

    var ui_title = document.createElement('h1');
    ui_title.textContent = '+vote';
    ui_title.classList.add('ui_title');
    ui_title.addEventListener('click', function() {
    	document.getElementById('top').scrollIntoView();
    	update_timeline();
    });
    ui_bar.appendChild(ui_title);

    var breaker = document.createElement('p');
    breaker.innerHTML = '&nbsp;';
    ui_bar.appendChild(breaker);

    // TODO: Rename user on click...
    var userblock = document.createElement('p');
    userblock.id = 'userblock';
    userblock.textContent = localStorage.getItem('username') ?? 'user001';
    ui_bar.appendChild(userblock);

    breaker = document.createElement('p');
    breaker.innerHTML = '&emsp;';
    breaker.style.float = 'right';
    ui_bar.appendChild(breaker);

    // Score
    var voteblock = document.createElement('p');
    voteblock.id = 'voteblock';
    voteblock.textContent = get_votes();
    ui_bar.appendChild(voteblock);

    el.appendChild(ui_bar);

    // TODO: Create add post

    var new_post = document.createElement('div');
    new_post.classList.add('ui_post', 'animate__animated', 'animate__fadeInDown');

    var post_text = document.createElement('p');
    post_text.textContent = 'New Post';
    new_post.appendChild(post_text);

    var image_field = document.createElement('input');
    image_field.type = 'file';
    image_field.accept = "image/*";

    image_field.addEventListener('change', function(event) {
    	var files = event.target.files;
        var file = files[0];
        
        if(file) {
        	var reader = new FileReader();

        	reader.onload = function(e) {
        		var img = document.createElement("img");
                img.src = e.target.result;

                img.onload = function() {
	                var canvas = document.createElement("canvas");
	                var ctx = canvas.getContext("2d");
	                ctx.drawImage(img, 0, 0);

	                var MAX_WIDTH = 600;
	                var MAX_HEIGHT = 600;
	                var width = img.width;
	                var height = img.height;

	                if (width > height) {
	                    if (width > MAX_WIDTH) {
	                        height *= MAX_WIDTH / width;
	                        width = MAX_WIDTH;
	                    }
	                } else {
	                    if (height > MAX_HEIGHT) {
	                        width *= MAX_HEIGHT / height;
	                        height = MAX_HEIGHT;
	                    }
	                }
	                canvas.width = width;
	                canvas.height = height;
	                var ctx = canvas.getContext("2d");
	                ctx.drawImage(img, 0, 0, width, height);
	 
	                var dataurl = canvas.toDataURL();

	                // Calculate a score...
	                var data = ctx.getImageData(0, 0, width, height);
	                var length = data.data.length;
	                var blockSize = 5;
	                var rgb = {r:0,g:0,b:0};
	                var i = -4;
	                var count = 0;
	                while ( (i += blockSize * 4) < length ) {
	                	++count;
	                	rgb.r += data.data[i];
        				rgb.g += data.data[i+1];
        				rgb.b += data.data[i+2];
	                }
	                rgb.r = ~~(rgb.r/count);
    				rgb.g = ~~(rgb.g/count);
    				rgb.b = ~~(rgb.b/count);

    				var score = Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b);

    				image_field.value = '';

	                // Create post here...
	                create_new_post(dataurl, score);
	                update_timeline();
            	}

        	}

        	reader.readAsDataURL(file);
        }
    })

    new_post.appendChild(image_field);

    el.appendChild(new_post);

    // Create existing post cards
    var timeline = document.createElement('ul');
    timeline.id = 'timeline';
    el.appendChild(timeline);
    update_timeline();
}

function app_load() {
	var el = document.getElementById("app");

	// Ensure we have localStorage access
	if(!test_localstorage()) {
		el.textContent = 'Error: Failed to access localStorage. Is it disabled?';
		el.className = '';
		el.classList.add("animate__animated", "animate__flash", "loading_intro");
		return;
	}

	// TODO: Ensure we have canvas access

	// Validate data...
	check_history();

	create_ui();

	// Add random trigger event to post from follower...
	trigger_follower_post();
}

window.addEventListener('load', app_load);
