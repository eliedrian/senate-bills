#!/usr/bin/env python3

import json
import re
import sys

import psycopg2

from datetime import datetime

if len(sys.argv) < 2:
    print(f'Usage: {sys.argv[0]} FILE')
    sys.exit(1)


with open(sys.argv[1]) as source:
    connection = psycopg2.connect('dbname=postgres user=postgres host=postgres password=p@ssw0rd')
    cursor = connection.cursor()

    def execute(q, v):
        try:
            cursor.execute(q, v)
            connection.commit()
        except:
            connection.rollback()

    def parse_bill(item):
        bill = {}
        bill['congress'] = int(re.match('\d+', item['congress'])[0])
        bill['number'] = int(item['number'])
        bill['date_filed'] = datetime.fromisoformat(item['date_filed']).date()
        bill['long_title'] = item['long_title']
        bill['short_title'] = item['short_title']
        bill['status'] = item['status']
        bill['url'] = item['url']
        bill['scope'] = item['scope']
        bill['vote_type'] = item['vote_type']
        bill['president_action'] = item['president_action']
        bill['president_received'] = item['president_received']
        bill['president_signed'] = item['president_signed']
        bill['republic_act'] = item['republic_act']
        return bill

    def insert_commitee(committee):
        cursor.execute('SELECT id FROM committee WHERE name = %s',
                (committee, ))
        committee_id = cursor.fetchone()

        if not committee_id:
            execute('INSERT INTO committee (name) VALUES (%s) RETURNING id;',
                    (committee, ))
            committee_id = cursor.fetchone()

        return committee_id[0]

    def insert_bill(bill):
        cursor.execute('SELECT id FROM bill WHERE congress = %s AND number = %s',
                (bill['congress'], bill['number']))
        bill_id = cursor.fetchone()

        if not bill_id:
            execute('INSERT INTO bill (congress, number, date_filed, long_title, '
                    + 'short_title, status, url, vote_type, president_action, '
                    + 'president_received, president_signed, republic_act, scope) '
                    + 'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) '
                    + 'RETURNING id;', (bill['congress'], bill['number'],
                        bill['date_filed'], bill['long_title'], bill['short_title'],
                        bill['status'], bill['url'], bill['vote_type'],
                        bill['president_action'], bill['president_received'],
                        bill['president_signed'], bill['republic_act'],
                        bill['scope']))
            bill_id = cursor.fetchone()

        return bill_id[0]

    def insert_advises(committee_id, bill_id, primary=False):
        execute('INSERT INTO advises (committee_id, bill_id, is_primary) '
                + 'VALUES (%s, %s, %s);', (committee_id, bill_id, primary))

    def insert_senator(senator):
        cursor.execute('SELECT id FROM senator WHERE name = %s', (senator, ))
        senator_id = cursor.fetchone()

        if not senator_id:
            execute('INSERT INTO senator (name) VALUES (%s) RETURNING id;',
                    (senator, ))
            senator_id = cursor.fetchone()
        return senator_id[0]

    def insert_author(author_id, bill_id):
        execute('INSERT INTO authors (senator_id, bill_id) VALUES (%s, %s);',
                (author_id, bill_id))

    def insert_sponsor(sponsor_id, bill_id, co_sponsor=False):
        execute('INSERT INTO sponsors (senator_id, bill_id, is_co_sponsor) '
                + 'VALUES (%s, %s, %s);', (sponsor_id, bill_id, co_sponsor))

    def insert_vote(senator_id, bill_id, is_approval=True):
        execute('INSERT INTO votes (senator_id, bill_id, is_approval) VALUES '
                + '(%s, %s, %s)', (senator_id, bill_id, is_approval))

    def insert_attachment(pdf):
        cursor.execute('SELECT id FROM attachment WHERE title = %s',
                (pdf['title'], ))
        attachment_id = cursor.fetchone()

        if not attachment_id:
            execute('INSERT INTO attachment (title, url) VALUES (%s, %s) '
            + 'RETURNING id;', (pdf['title'], pdf['url']))
            attachment_id = cursor.fetchone()
        return attachment_id[0]

    def insert_accompanies(attachment_id, bill_id):
        execute('INSERT INTO accompanies (attachment_id, bill_id) VALUES '
                + '(%s, %s)', (attachment_id, bill_id))

    def insert_subject(subject):
        cursor.execute('SELECT id FROM subject WHERE name = %s', (subject, ))
        subject_id = cursor.fetchone()

        if not subject_id:
            execute('INSERT INTO subject (name) VALUES (%s) RETURNING id;',
                    (subject, ))
            subject_id = cursor.fetchone()
        return subject_id[0]

    def insert_tags(subject_id, bill_id):
        execute('INSERT INTO tags (subject_id, bill_id) VALUES (%s, %s);',
                (subject_id, bill_id))

    for line in source:
        item = json.loads(line)

        bill = parse_bill(item)

        primary_committee_id = None
        if item['primary_committee']:
            primary_committee_id = insert_commitee(item['primary_committee'])

        secondary_committees = tuple(committee.strip() for committee in item['secondary_committees'])
        secondary_committee_ids = []
        for committee in secondary_committees:
            secondary_committee_ids.append(insert_commitee(committee))

        bill_id = insert_bill(bill)

        # insert advises
        if primary_committee_id:
            insert_advises(primary_committee_id, bill_id, primary=True)
        for committee_id in secondary_committee_ids:
            insert_advises(committee_id, bill_id)

        author_ids = []
        for senator in item['authors']:
            author_ids.append(insert_senator(senator))
        for author_id in author_ids:
            insert_author(author_id, bill_id)

        sponsor_ids = []
        if item['sponsors']:
            for senator in item['sponsors']:
                sponsor_ids.append(insert_senator(senator))
            for sponsor_id in sponsor_ids:
                insert_sponsor(sponsor_id, bill_id)

        co_sponsor_ids = []
        if item['co_sponsors']:
            for senator in item['co_sponsors']:
                co_sponsor_ids.append(insert_senator(senator))
            for sponsor_id in co_sponsor_ids:
                insert_sponsor(sponsor_id, bill_id, co_sponsor=True)

        yes_vote_ids = []
        if item['vote_yes']:
            for senator in item['vote_yes']:
                yes_vote_ids.append(insert_senator(senator))
            for senator_id in yes_vote_ids:
                insert_vote(senator_id, bill_id, is_approval=True)

        no_vote_ids = []
        if item['vote_no']:
            for senator in item['vote_no']:
                no_vote_ids.append(insert_senator(senator))
            for senator_id in no_vote_ids:
                insert_vote(senator_id, bill_id, is_approval=False)

        if item['pdf_download_urls']:
            attachment_ids = []
            for pdf in item['pdf_download_urls']:
                attachment_ids.append(insert_attachment(pdf))
            for attachment_id in attachment_ids:
                insert_accompanies(attachment_id, bill_id)

        if item['subjects']:
            subject_ids = []
            for subject in item['subjects']:
                subject_ids.append(insert_subject(subject))
            for subject_id in subject_ids:
                insert_tags(subject_id, bill_id)

    cursor.close()
    connection.close()
    sys.exit(0)

