#! /usr/bin/python
# Python 2 diff of two lists.

# Author: Pete Jansz

from os import chdir
import re, sys, string, os.path, io
from optparse import OptionParser

parser = OptionParser()

def parse_cli_args():
    parser.add_option('--file1', action='store', help='Input file 1', type=str, dest='file1', metavar='FILE')
    parser.add_option('--file2', action='store', help='Input file 2', type=str, dest='file2', metavar='FILE')
    parser.add_option('--difftype', action='store', help='1: f1-f2, 2: f2-f1, 3:xor(f1, f2)', type=int, dest='difftype')
    return parser.parse_args()

def load_list( filename ):
    alist = []
    fin = open(filename, 'r')

    for line in fin.readlines():
        alist.append(line.strip().strip('+.'))

    fin.close()

    return alist

def diff_lists(list1, list2, choice):
    if choice == 1:
        return list(set(list1) - set(list2))
    elif choice == 2:
        return list(set(list2) - set(list1))
    elif choice == 3:
        return list(set(list1).symmetric_difference(set(list2)))

def main():
    exit_value = 1
    options, args = parse_cli_args()

    if not options.file1 or not options.file2 or not options.difftype or options.difftype > 3:
        parser.print_help()
        exit(exit_value)

    for f in options.file1, options.file2:
        if not os.path.exists( f ):
            print >>sys.stderr, 'File not found: ' + f
            exit(exit_value)

    for item in diff_lists(load_list(options.file1), load_list(options.file2), options.difftype):
        print(item)

    exit_value = 0
    exit(exit_value)

if __name__ == "__main__":
    main()
