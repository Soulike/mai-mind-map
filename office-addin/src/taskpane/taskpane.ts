/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import { MessageHelper } from "./helpers/MessageHelper";
import { DocumentType, MindMapGenHelper } from "./helpers/MindMapGenHelper";
import { WordHelper } from "./helpers/WordHelper";

/* global document, Office, console */

const submitAllButton = document.getElementById("btn-submit-all");
const submitSelectedButton = document.getElementById("btn-submit-selected");

Office.onReady((info) => {
  if (info.host === Office.HostType.Word) {
    submitAllButton.addEventListener("click", onSubmitAllButtonClick);
    submitSelectedButton.addEventListener("click", onSubmitSelectedButtonClick);
  }
});

async function onSubmitAllButtonClick() {
  try {
    MessageHelper.showMessage("Generating mind map for document...");
    const [title, content] = await Promise.all([WordHelper.getDocumentTitle(), WordHelper.getDocumentContent()]);

    const mindMapUuid = await MindMapGenHelper.fromDocument({
      type: DocumentType.DOCX,
      title,
      content,
    });

    await WordHelper.showMindMapDialog(mindMapUuid);
    MessageHelper.clearMessage();
  } catch (e) {
    MessageHelper.showMessage(e.message);
    console.error(e);
  }
}

async function onSubmitSelectedButtonClick() {
  try {
    MessageHelper.showMessage("Generating mind map for selected text...");
    const [title, selectedContent] = await Promise.all([
      WordHelper.getDocumentTitle(),
      WordHelper.getDocumentSelectedContent(),
    ]);

    const mindMapUuid = await MindMapGenHelper.fromDocument({
      type: DocumentType.DOCX,
      title,
      content: selectedContent,
    });

    await WordHelper.showMindMapDialog(mindMapUuid);
    MessageHelper.clearMessage();
  } catch (e) {
    MessageHelper.showMessage(e.message);
    console.error(e);
  }
}
