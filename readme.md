# Graduate Student Seminar Official Website

## Description

The Graduate Student seminar is a seminar organized by a committee of graduate students in the Math department at Western University. This comitee is also in charge of maintaining this GitHub repository.
The seminar is usually organized twice per year, with each edition of the seminar corresponding to an academic term (Fall or Winter). 
Github was chosen as the hosting service for the website for their versatility with HTML, LaTex and Markdown.
The theme for the website is based on [Beautiful-Jekyll](https://github.com/daattali/beautiful-jekyll); a description of this template and how it was implemented can be found [here](https://github.com/UWOMathGrad/UWOMathGrad.github.io/blob/master/README_OLD.md).

## How the site is distributed

- The **homepage** is built using [`index.html`](./index.html). The site title, description and organizers' email addresses can be updated in [`_config.yml`](./_config.yml).
- The **navigation bar** can be modified in [`_config.yml`](./_config.yml) as well. The logo file must be updated in the **img** folder.
- The folder **editions** contains the Markdown Files for each edition of the seminar. The navigation bar must be updated with each new edition, and the recently finished edition must be moved to the **past editions** tab.
- The folder **docs** contains documents related to the seminar (abstracts, tex or pdf files, etc.).
- Any other folders/files are elements for building the website under the chosen theme; modify them to change the layout of the website.


## Organization

The 2019 organizers started a [Google Docs spreadhseet](https://docs.google.com/spreadsheets/d/1xmKC9H9zwDQFBtqjQcaKW6DqvJvyuQSYxZIxEgGOeFo/edit#gid=0) to keep track of the funding used, dates and potential speakers for the seminar.
It is expected that after every change of committee, the ownership of this document will be transfered to the new members. If you are a new organizing member and still have no access to the document, please contact a commitee member from the previous edition.
It is also expected that each new comittee will keep mantaining the website and keep all information up to date. Ask the current commitee to add you to the [official repository](https://github.com/UWOMathGrad) in GitHub, and please give continuity to the project.

## Commitee and Mantainance

The current edition, **Winter 2020**, is currently organized by the following graduate students:

- Félix Baril Boudreau (fbarilbo)
- Udit Ajit Mavinkurve (umavinku)
- Marios Velivasakis (mvelivas)

And [BBFelix](https://github.com/BBFelix) is currently in charge of maintaining the website.

### Previous Organizers

The development of the website in GitHub started with the **Fall 2019** committee. For information on the previous organizers and the initial development of the website on GoogleSites visit the [legacy webpage](https://sites.google.com/site/uwograduateseminar/home).

## Credits

This GitHub project has no direct relation with the official Mathematics Deparment [Website](https://www.math.uwo.ca/) or any other dependency at [Western University](https://www.uwo.ca/), but the organizers thank the Department for their support and funding throughout the many editions of this project.

The template of the website and all its development belong to  [Dean Attali](https://deanattali.com/) who made possible the nice style that this website currently has with his open source project [Beautiful-Jekyll](https://github.com/daattali/beautiful-jekyll).

The migration of the legacy website from GoogleSites to the current version in GitHub, the support of LaTeX into the theme, and the development of the website were done by [@slchavesr](https://github.com/slchavesr). The abstracts from the legacy site were transfered to this version by [@BBFelix](https://github.com/bbfelix) and [@bcldoherty](https://github.com/bcldoherty).
