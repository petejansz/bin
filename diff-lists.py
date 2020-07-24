#! /usr/bin/python
# Python 2 diff of two lists.

# Author: Pete Jansz

from os import chdir
import collections, re, sys, string, os.path, io
from optparse import OptionParser

parser = OptionParser()

def parse_cli_args():
    parser.add_option('--f1', action='store', help='Input file 1', type=str, dest='f1', metavar='FILE')
    parser.add_option('--f2', action='store', help='Input file 2', type=str, dest='f2', metavar='FILE')
    parser.add_option('--difftype', action='store', help='1: f1-f2, 2: f2-f1, 3:xor(f1, f2)', type=int, dest='difftype')
    parser.add_option('--delim', action='store', help='Delimiter, default=\\t', type=str, dest='delim', default='\t')
    parser.add_option('--key', action='store', help='Primary key and to sort key: 0..tokens-1. Default=0', type=int, dest='key', default=0)
    return parser.parse_args()

def load_list( filename ):
    alist = []
    fin = open(filename, 'r')

    for line in fin.readlines():
        alist.append(line.strip().strip('+.'))

    fin.close()

    return alist

def load_dict( filename, options ):
    dictx = {}
    fin = open(filename, 'r')

    for line in fin.readlines():
        tokens = line.strip().strip('+.').split(options.delim)
        key = tokens[options.key].strip()
        dictx[key] = line.strip().strip('+.')

    fin.close()

    ordered_dict = collections.OrderedDict(sorted(dictx.items()))

    return ordered_dict

def diff_lists(list1, list2, choice):
    if choice == 1:
        return list(set(list1) - set(list2))
    elif choice == 2:
        return list(set(list2) - set(list1))
    elif choice == 3:
        return list(set(list1).symmetric_difference(set(list2)))

def mk_diff_key(key, left):
    diff_key = ''
    if left:
        diff_key = '< [' + key + ']'
    else:
        diff_key = '> [' + key + ']'
    return diff_key

def append_dict(d1, d2):
    for key in d2:
        d1[key] = d2[key]
    return d1

def diff_dicts(dict1, dict2, options):
    delta_dict = collections.OrderedDict()

    for key in dict1.keys():
        if key not in dict2:
            delta_dict[mk_diff_key(key, True)] = dict1[key]
        else:
            adict = diff_record(dict1[key], dict2[key], options)
            delta_dict = append_dict(delta_dict, adict)

    for key in dict2.keys():
        if key not in dict1:
            delta_dict[mk_diff_key(key, False)] = dict2[key]
        else:
            adict = diff_record(dict1[key], dict2[key], options)
            delta_dict = append_dict(delta_dict, adict)

    return delta_dict

def diff_record(s1, s2, options):
    """
        Tokenize s1, s2 and return a dictionary, identifying first tokens which differ
    """
    diff = {}
    s1_tokens = s1.split(options.delim)
    s2_tokens = s2.split(options.delim)

    if len(s1_tokens) == len(s2_tokens):
        if diff_lists(s1_tokens, s2_tokens, 3):
            for i in range(0, len(s1_tokens)-1):
                token1 = s1_tokens[i]
                token2 = s2_tokens[i]
                if token1 != token2:
                    key1 = mk_diff_key( token1, True )
                    diff[key1] = s1
                    key2 = mk_diff_key( token2, False )
                    diff[key2] = s2
                    break
    elif len(s1_tokens) > len(s2_tokens):
        for record in diff_lists(s1_tokens, s2_tokens, 1):
            key = mk_diff_key(record[options.key], True)
            diff[key] = record
    elif len(s1_tokens) < len(s2_tokens):
        for record in diff_lists(s1_tokens, s2_tokens, 2):
            key = mk_diff_key(record[options.key], False)
            diff[key] = record

    return diff

def main():
    exit_value = 1
    options, args = parse_cli_args()

    if not options.f1 or not options.f2 or not options.difftype or options.difftype > 3:
        parser.print_help()
        exit(exit_value)

    for f in options.f1, options.f2:
        if not os.path.exists( f ):
            print >>sys.stderr, 'File not found: ' + f
            exit(exit_value)

    # for item in diff_lists(load_list(options.f1), load_list(options.f2), options.difftype):
    #     print(item)
    dict1 = load_dict(options.f1, options)
    dict2 = load_dict(options.f2, options)
    diff_dict = diff_dicts(dict1, dict2, options)
    for key in diff_dict.keys():
        print(key + ' ' + diff_dict[key])

    exit_value = 0
    exit(exit_value)

if __name__ == "__main__":
    main()
