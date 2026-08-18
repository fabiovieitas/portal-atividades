const express = require('express');
const path = require('path');
const dbHelper = require('../db');

async function testHome() {
  try {
    console.log('Testing app.get(/) rendering...');
    const level = undefined;
    const search = undefined;
    const category = undefined;
    const bncc = undefined;
    const subject = undefined;

    let activities = await dbHelper.getActivities({ level, search, category, bncc, subject });
    console.log('Activities loaded count:', activities.length);

    const categoriesAndSubjects = await dbHelper.getCategoriesAndSubjects();
    console.log('Categories & Subjects:', categoriesAndSubjects);

    const comments = await dbHelper.getApprovedComments(15);
    console.log('Comments count:', comments.length);

    const news = await dbHelper.getNews();
    console.log('News count:', news.length);

    console.log('✅ ALL DATA FOR HOME RENDER LOADED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ RENDER ERROR TRACEBACK:', err.stack || err);
  }
}

testHome().catch(console.error);
