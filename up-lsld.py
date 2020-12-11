#! /usr/bin/python

"""
    Purpose: Print directory perms, owner, group from default . or --path to root
    Author: Pete Jansz
    V1.0.0.0: 2020-12-11
"""

import sys, string, os, io, subprocess
from subprocess import Popen, PIPE
from optparse import OptionParser

parser = OptionParser()

def parse_cli_args():
    parser.description = r"Print directory perms, owner, group from default . or --path to root"
    parser.add_option('--path', action='store', help='Directory path', type=str, default='.', dest='path', metavar='FILE')
    return parser.parse_args()

def format_ls_ld_stdout(stdoutObj):
    aline = ''
    if type(stdoutObj) == str:
        aline = stdoutObj.strip()
    else:
        aline = stdoutObj.decode("utf-8").strip()

    tokens = aline.split()
    perms = tokens[0]
    owner = tokens[2]
    group = tokens[3]
    timestamp = '%s %2s %5s' % (tokens[5], tokens[6], tokens[7])
    path = tokens[8]
    format = '%s %18s %18s %s %s'
    formatted = format % (perms, owner, group, timestamp, path)
    return formatted

def main():
    exit_value = 1
    options, args = parse_cli_args()
    # cwddir = os.getcwd()
    normpath = os.path.abspath(options.path)
    pathnames = normpath.split(os.sep)

    for dir in pathnames[1:]:
        abspath = os.sep.join(pathnames)
        process_session = Popen(
            ['ls', '-ld', abspath], stdin=PIPE, stdout=PIPE, stderr=PIPE)
        if process_session.wait() == 0:

            stdoutStrings, stderrStrings = process_session.communicate()

            if process_session.returncode == 0 and len(stdoutStrings) != 0 and len(stderrStrings) == 0:
                print(format_ls_ld_stdout(stdoutStrings))
            else:
                exception = str(stderrStrings)

                if exception.count('\\r'):
                    exception = exception.split('\\r')[0].strip()
                else:
                    exception = exception.split('\r')[0].strip()

                raise ValueError(exception)
        else:
            raise Exception('Popen subprocess failed.')

        pathnames.pop()

    exit_value = 0
    exit(exit_value)

if __name__ == "__main__":
    main()
