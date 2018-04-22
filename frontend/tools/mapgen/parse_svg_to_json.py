"""Parse an appropriate svg map into data that frontend can use. Tested on Python 2.7.14 & Python 3.6.5."""

import json
import re
import sys
from xml.dom import minidom

# valid formats are districts (CA_13, MO_AtLarge) or states (CA)
idRegex = re.compile(r'[A-Z][A-Z]')

if len(sys.argv) != 3:
    print('usage: parse_svg_to_json.py [svg_file] [destination_json]')
    exit()

with open(sys.argv[1], 'r') as svg_file:
    doc = minidom.parse(svg_file)
    svgs = doc.getElementsByTagName('svg')
    if len(svgs) != 1:
        print('WARNING: multiple svgs found. possible malformed svg')
    viewBox = '0 0 ' + svgs[0].getAttribute('width') + ' ' + svgs[0].getAttribute('height')
    paths = doc.getElementsByTagName('path')
    if len(paths) == 0:
        print('WARNING: no paths found. possible malformed svg')
    id_and_path_strings = [[path.getAttribute('id'), path.getAttribute('d')] for path in paths]
    doc.unlink()

    data = {'viewBox': viewBox}
    valid_paths = [idtuple for idtuple in id_and_path_strings if re.search(idRegex, idtuple[0])]
    skipped_paths = [idtuple for idtuple in id_and_path_strings if re.search(idRegex, idtuple[0]) is None]

    if len(valid_paths) == 0:
        print('WARNING: no valid paths could be found, please inspect the svg')
    else:
        for obj in valid_paths:
            data[obj[0]] = {'dimensions': obj[1], 'abbreviation': obj[0]}

    with open(sys.argv[2], 'w') as outfile:
        json.dump(data, outfile)
    print('written to ' + sys.argv[2] + ': ' + str(len(skipped_paths)) + ' paths skipped')
