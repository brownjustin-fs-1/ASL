const {
  contacts,
  ContactModel,
  Pager,
  sortContacts,
  filterContacts,
} = require("@jworkman-fs/asl");

let contactList = [...contacts];

const handleError = (res, error) => {
  switch (error.name) {
    case "ContactNotFoundError":
    case "NoContactsFoundError":
      return res.status(404).json({ message: error.message });

    case "DuplicateContactResourceError":
    case "InvalidContactResourceError":
    case "InvalidContactFieldError":
    case "InvalidContactSchemaError":
    case "BlankContactFieldError":
    case "InvalidOperatorError":
    case "InvalidEnumError":
    case "PagerOutOfRangeError":
    case "PagerNoResultsError":
      return res.status(400).json({ message: error.message });

    default:
      return res.status(500).json({ message: error.message });
  }
};

const index = (req, res) => {
  try {
    let results = [...contactList];

    const filterBy = req.get("X-Filter-By");
    const filterOperator = req.get("X-Filter-Operator");
    const filterValue = req.get("X-Filter-Value");

    if (filterBy && filterValue) {
      results = filterContacts(
        results,
        filterBy,
        filterOperator || "eq",
        filterValue,
      );
    }

    if (req.query.sort) {
      results = sortContacts(
        results,
        req.query.sort,
        req.query.direction || "asc",
      );
    }

    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 10;

    const pager = new Pager(results, page, size);

    res.set("X-Page-Total", String(pager.pages));
    res.set("X-Page-Next", String(pager.next()));
    res.set("X-Page-Prev", String(pager.prev()));

    return res.status(200).json(pager.results());
  } catch (error) {
    return handleError(res, error);
  }
};

const show = (req, res) => {
  try {
    const contact = ContactModel.show(Number(req.params.id), contactList);
    return res.status(200).json(contact);
  } catch (error) {
    return handleError(res, error);
  }
};

const create = (req, res) => {
  try {
    const contact = ContactModel.create(req.body, contactList);
    contactList.push(contact);
    return res.status(201).json(contact);
  } catch (error) {
    return handleError(res, error);
  }
};

const update = (req, res) => {
  try {
    ContactModel.update(Number(req.params.id), req.body, contactList);
    return res.status(303).redirect(`/contacts/${req.params.id}`);
  } catch (error) {
    return handleError(res, error);
  }
};

const destroy = (req, res) => {
  try {
    ContactModel.remove(Number(req.params.id), contactList);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
};
