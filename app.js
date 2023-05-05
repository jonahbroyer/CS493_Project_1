const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

// API endpoints for businesses
const businesses = [
    {
        name: "Cafe Yumm",
        address: "1500 NE Cushing Dr #130",
        city: "Bend",
        state: "OR",
        zip: 97701,
        phone: 541-322-9866,
        category: "Restaurant",
        subcategory: "Rice bowl",
        website: "https://www.cafeyumm.com/locations/neff-place/",
        email: "fakecafeyummemail@gmail.com"
    },
    {
        name: "Five Guys",
        address: "222 NE Emerson Ave Suite 103",
        city: "Bend",
        state: "OR",
        zip: 97701,
        phone: 541-797-7787,
        category: "Restaurant",
        subcategory: "Burger",
        website: "https://www.fiveguys.com/",
        email: "fakefiveguysemail@gmail.com"
    },
    {
        name: "Google",
        address: "1600 Amphitheatre Parkway",
        city: "Mountain View",
        state: "CA",
        zip: 94043,
        phone: 1-800-419-0157,
        category: "Technology",
        subcategory: "Search engine",
        website: "http://www.google.com/",
        email: "fakegmail@gmail.com"
    },
];

app.get('/businesses', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(businesses.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pageBusinesses = businesses.slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = '/businesses?page=' + (page + 1);
        links.lastPage = '/businesses?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/businesses?page=' + (page - 1);
        links.firstPage = '/businesses?page=1';
    }  
    
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: businesses.length,
        businesses: pageBusinesses,
        links: links
    });
});

app.use(express.json());

app.post('/businesses', jsonParser, (req, res) => {
    if (req.body && req.body.name) {
        businesses.push(req.body);
        var id = businesses.length - 1;
        res.status(201).json({
            id: id,
            links: {
                business: '/businesses/' + id
            }
    });
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with a name field"
        });
    }
});

app.get('/businesses/:businessID', (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        res.status(200).json(businesses[businessID]);
    } else {
        next();
    }
});

app.put('/businesses/:businessID', (req, res) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        if (req.body && req.body.name) {
            businesses[businessID] = req.body;
            res.status(200).json({
                links: {
                    business: '/businesses/' + businessID
                }
        });
        } else {
            res.status(400).json({
                err: "Request needs a JSON body with a name field"
            });
        }
    } else {
        next();
    }
});

app.delete('/businesses/:businessID', (req, res, next) => {
    var businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
        businesses[businessID] = null;
        res.status(204).end();
    } else {
        next();
    }
});

// API endpoints for reviews
const reviews = [
    {
        starRating: 5,
        dollarRating: 4,
        review: "This is the best place eva"
    },
    {
        starRating: 2,
        dollarRating: 3,
        review: "Not really feeling it"
    },
    {
        starRating: 1,
        dollarRating: 5,
        review: "Why does this place exist?"
    },
];

app.post('/reviews', jsonParser, (req, res) => {
    if (req.body && req.body.starRating && req.body.dollarRating) {
        reviews.push(req.body);
        var id = reviews.length - 1;
        res.status(201).json({
            id: id,
            links: {
                review: '/reviews/' + id
            }
        });
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with a star rating field and dollar rating field"
        });
    }
});

app.put('/reviews/:reviewID', (req, res, next) => {
    var reviewID = parseInt(req.params.reviewID);
    if (reviews[reviewID]) {
        if (req.body && req.body.starRating && req.body.dollarRating) {
            reviews[reviewID] = req.body;
            res.status(200).json({
                links: {
                    review: '/reviews/' + reviewID
                }
        });
        } else {
            res.status(400).json({
                err: "Request needs a JSON body with a star rating field and dollar rating field"
            });
        }
    } else {
        next();
    }
});
  
app.delete('/reviews/:reviewID', (req, res, next) => {
    var reviewID = parseInt(req.params.reviewID);
    if (reviews[reviewID]) {
        reviews[reviewID] = null;
        res.status(204).end();
    } else {
        next();
    }
});

// API endpoints for photos
const photos = [
    {
        imageFile: "/example.jpg",
        caption: "This Yumm bowl hit the spot!"
    },
    {
        imageFile: "/potato.jpg",
        caption: "Why does this look funny?"
    },
    {
        imageFile: "/soup.jpg",
        caption: "Good Soup!"
    },
];

app.post('/photos', jsonParser, (req, res) => {
    if (req.body && req.body.imageFile) {
        photos.push(req.body);
        res.json({"status": "ok"});
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with an image file field"
        });
    }

    var id = photos.length - 1;
    res.status(201).json({
        id: id,
        links: {
            photo: '/photos/' + id
        }
    });
});

app.delete('/photos/:photoID', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
        photos[photoID] = null;
        res.status(204).end();
    } else {
        next();
    }
});

app.put('/photos/:photoID', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
        if (req.body && req.body.imageFile) {
            photos[photoID] = req.body;
            res.status(200).json({
                links: {
                    photo: '/photos/' + photoID
                }
        });
        } else {
            res.status(400).json({
                err: "Request needs a JSON body with an image file field"
            });
        }
    } else {
        next();
    }
});

app.get('/photos', (req, res) => {
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(photos.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pagephotos = photos.slice(start, end);
    var links = {};
    if (page < lastPage) {
        links.nextPage = '/photos?page=' + (page + 1);
        links.lastPage = '/photos?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/photos?page=' + (page - 1);
        links.firstPage = '/photos?page=1';
    }  
    
    res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: photos.length,
        photos: pagephotos,
        links: links
    });
});

app.get('/photos/:photoID/businesses', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(businesses.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pageBusinesses = businesses.slice(start, end);
    var links = {};

    if (page < lastPage) {
        links.nextPage = '/photos/:photoID/businesses?page=' + (page + 1);
        links.lastPage = '/photos/:photoID/businesses?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/photos/:photoID/businesses?page=' + (page - 1);
        links.firstPage = '/photos/:photoID/businesses?page=1';
    }  
    
    if (photos[photoID]) {
        res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: businesses.length,
        businesses: pageBusinesses[photoID],
        links: links});
    } else {
        next();
    }
});

app.get('/photos/:photoID/reviews', (req, res, next) => {
    var photoID = parseInt(req.params.photoID);
    var page = parseInt(req.query.page) || 1;
    var numPerPage = 10;
    var lastPage = Math.ceil(reviews.length / numPerPage);
    page = page < 1 ? 1 : page;
    page = page > lastPage ? lastPage : page;
    var start = (page - 1) * numPerPage;
    var end = start + numPerPage;
    var pagereviews = reviews.slice(start, end);
    var links = {};

    if (page < lastPage) {
        links.nextPage = '/photos/:photoID/reviews?page=' + (page + 1);
        links.lastPage = '/photos/:photoID/reviews?page=' + lastPage;
    }
    if (page > 1) {
        links.prevPage = '/photos/:photoID/reviews?page=' + (page - 1);
        links.firstPage = '/photos/:photoID/reviews?page=1';
    }  
    
    if (photos[photoID]) {
        res.status(200).json({
        pageNumber: page,
        totalPages: lastPage,
        pageSize: numPerPage,
        totalCount: reviews.length,
        reviews: pagereviews[photoID],
        links: links});
    } else {
        next();
    }
});
