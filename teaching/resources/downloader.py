# python script to download a set of WeBWork-OPL problems from the official OPL repository
# The problem list is saved in a .def file downloaded from webwork
# The script creates separate .pg files for the problem list, it keeps the same name as in the source file
# How To Use: place the .def file in the same folder as this script, modify the filename below according to your .def file and run it

import requests

# enter the filename here, here we use set1.def 
filename = open('set1.def', 'r') 
Lines = filename.readlines() 
  

for line in Lines: 
    arr_tmp = line.split("=")
    if len(arr_tmp) > 1 :
        if (arr_tmp[0].strip() == "source_file"):
            dir = arr_tmp[1].strip();
            group  = dir.split('/')[0]
            name = dir.split('/')[-1]
            # prints the filename in the console
            # print(name)
            if (group == "Library"):
                url = "https://raw.githubusercontent.com/openwebwork/webwork-open-problem-library/master/OpenProblemLibrary/" + dir[len(group)+1:]
                print(url)
                r = requests.get(url, allow_redirects=True)
                with open(name, 'wb') as f:
                    f.write(r.content)
