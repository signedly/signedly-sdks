

# FillAndSendDocumentRequest


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**documentId** | **UUID** | The document&#39;s ID. |  |
|**elements** | [**List&lt;FillAndSendDocumentRequestElementsInner&gt;**](FillAndSendDocumentRequestElementsInner.md) | The fields to change; the others keep their values. |  [optional] |
|**email** | **String** | The signatory&#39;s email address. |  |
|**expiryDate** | **LocalDate** | The last day the document can be signed, YYYY-MM-DD; it must be in the future. |  |
|**message** | **String** | The email&#39;s message; may be empty (\&quot;\&quot;), not null. |  |
|**name** | **String** | The signatory&#39;s name. |  |
|**reminderBeforeExpiryDays** | **Integer** | One more reminder this many days before the deadline (2–30); 0 is off. Every signatory still waiting is also reminded the day before it. |  [optional] |
|**reminderEveryDays** | **Integer** | Automatic reminders: email each signatory who hasn&#39;t signed yet every this many days (1–30) after they were asked; 0 is off. Left out, your organisation&#39;s default applies (off unless set in the web app). |  [optional] |
|**reminderMax** | **Integer** | At most this many automatic reminders per signatory (1–10; 3 if left out while &#x60;reminder_every_days&#x60; is on). |  [optional] |
|**subject** | **String** | The email&#39;s subject. |  |



