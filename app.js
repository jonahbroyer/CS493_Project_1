const express = require('express')
const app = express()
const port = 3000

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

app.post('/businesses', (req, res) => {
    if (req.body && req.body.name) {
        businesses.push(req.body);
    } else {
        res.status(400).json({
            err: "Request needs a JSON body with a name field"
        });
    }

    var id = businesses.length - 1;
    res.status(201).json({
        id: id,
        links: {
            business: '/businesses/' + id
        }
    });
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
  
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
