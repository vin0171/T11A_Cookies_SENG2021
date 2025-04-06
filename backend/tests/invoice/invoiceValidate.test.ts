import { validateUBL } from '../../validation';
import { validUBLInvoice } from '../invoice';


describe('validateUBL', () => {
    let validUBL: string;

    beforeEach(() => {
      validUBL = validUBLInvoice;
    });
  
    test('should pass with valid UBL XML', () => {
      expect(validateUBL(validUBL)).toBe(true);
    });

    test('should fail if XML is malformed', () => {
        const brokenXML = '<Invoice><cbc:ID>123</cbc:ID>';
        expect(validateUBL(brokenXML)).toBe(false);
    });

    test('should fail if Invoice ID is missing', () => {
        const xml = validUBL.replace(/<cbc:ID>.*?<\/cbc:ID>/, '');
        expect(validateUBL(xml)).toBe(false);
    });

    test('should fail if IssueDate is not in YYYY-MM-DD format', () => {
        const xml = validUBL.replace(/<cbc:IssueDate>.*?<\/cbc:IssueDate>/, '<cbc:IssueDate>12-2023-01</cbc:IssueDate>');
        expect(validateUBL(xml)).toBe(false);
    });

    test('should fail if neither StartDate nor EndDate in InvoicePeriod', () => {
        const xml = validUBL
        .replace(/<cbc:StartDate>.*?<\/cbc:StartDate>/, '')
        .replace(/<cbc:EndDate>.*?<\/cbc:EndDate>/, '');
        expect(validateUBL(xml)).toBe(false);
    });

    test('should fail if PayableAmount is empty', () => {
        const xml = validUBL.replace(/<cbc:PayableAmount currencyID=".*?">.*?<\/cbc:PayableAmount>/, '<cbc:PayableAmount currencyID="USD"></cbc:PayableAmount>');
        expect(validateUBL(xml)).toBe(false);
    });

    test('should fail if currency is invalid', () => {
        const xml = validUBL.replace(/currencyID=".*?"/g, 'currencyID="FAKE"');
        expect(validateUBL(xml)).toBe(false);
    });

    test('should fail if Invoice has no lines', () => {
        const xml = validUBL.replace(/<cac:InvoiceLine[\s\S]*?<\/cac:InvoiceLine>/g, '');
        expect(validateUBL(xml)).toBe(false);
    });

    test('should fail if LineExtensionAmount currency mismatches Invoice currency', () => {
        const xml = validUBL.replace(/<cbc:LineExtensionAmount currencyID=".*?"/, '<cbc:LineExtensionAmount currencyID="EUR"');
        expect(validateUBL(xml)).toBe(false);
    });

    test('should fail if Party name is duplicated', () => {
        const xml = validUBL.replace(/<cbc:Name>.*?<\/cbc:Name>/g, '<cbc:Name>DuplicateName</cbc:Name><cbc:Name>DuplicateName</cbc:Name>');
        expect(validateUBL(xml)).toBe(false);
    });
});
