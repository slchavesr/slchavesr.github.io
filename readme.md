# Graduate Student Seminar Official Website

## Description

The Graduate Student seminar is a seminar organized by a committee of Graduate Students at the Math department at Western. This comitee is also in charge of the mantinence of the github repository.
Each edition of the seminar corresponds to an academic term (Fall or Winter) and it is then usually organized twice per year. 
Github pages was chosen as the hosting for the website for their versatility with HTML, Latex and Markdown.
The theme for the website is based on [Beautiful-Jekyll](https://github.com/daattali/beautiful-jekyll) and the description on how was implemented can be found [here](https://github.com/UWOMathGrad/UWOMathGrad.github.io/blob/master/README_OLD.md)

## How is the site distributed.

- The **homepage** is build using [`index.html`](./index.html) and the site title, description and organizers email adress can be updated in [`_config.yml`](./_config.yml).
- The **navigation bar** can be modified in [`_config.yml`](./_config.yml) as well and the logo file must be updated in the **img** folder.
- The folder **editions** contains the Markdown Files to each edition of the seminar. The navigation bar must be updated each time a new edition occurs; and move the recently finished edition to the **past editions** tab.
- The folder **docs** contains the documents related to the seminar. (abstracts, tex or pdf files, etc)
- Any others folders/files are elements for building the website under the chosen theme and modify them in case the layout of the website wants to be changed.


## Organization

The 2019 organizers started implementing a [Google Docs spreadhseet](https://docs.google.com/spreadsheets/d/1xmKC9H9zwDQFBtqjQcaKW6DqvJvyuQSYxZIxEgGOeFo/edit#gid=0) to keep track of the funding used, dates and potential speakers for the seminar.
It is expected that after every change of committee, the ownership of this document is transfered to the new members. If you are a new organizing member and still have no access to the document, please contact a commitee member from the previous edition.
It is also expected that the new comitte keep mantaining the website and keep the next information up to date. Ask the current commitee for being added to the [official repository](https://github.com/UWOMathGrad) in GitHub and please give continuity to the project.

## Commitee and Mantainance

The current version **Fall 2019** is currently organized by the graduate students:

- Félix Baril Boudreau (fbarilbo)
- Sergio Chaves (schavesr)
- Brandon Doherty (bdoher)
- Marios Velivasakis (mvelivas)

And the mantainance of the website is currently under the charge of [schavesr](https://github.com/slchavesr).

### Previous Organizers

The development of the website in GitHub started with the **Fall 2019** committee. For previous organizers and the initial development on GoogleSites visit the [legacy webpage](https://sites.google.com/site/uwograduateseminar/home).

## Credits

The GitHub project has no direct relation with the official Mathematics Deparment [Website](https://www.math.uwo.ca/) or any other dependency at [Western University](https://www.uwo.ca/); yet the Graduate Students thank to the Department for their support and funding througout the several editions of this project.

The template of the website and all its development belong to  [Dean Attali](https://deanattali.com/) who made possible the nice current style that this website has with his open source project [Beautiful-Jekyll](https://github.com/daattali/beautiful-jekyll).

The migration of the legacy website from GoogleSites to the current version in GitHub, the support of LaTeX into the theme and the development of the website were made by [@slchavesr](https://github.com/slchavesr).
