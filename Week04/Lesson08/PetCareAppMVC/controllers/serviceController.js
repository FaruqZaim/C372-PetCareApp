const petModel = require('../models/petModel');
const serviceModel = require('../models/serviceModel');
const serviceBookingModel = require('../models/serviceBookingModel');

function getLocalToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isPositiveInteger(value) {
  return /^\d+$/.test(String(value)) && Number(value) > 0;
}

function isValidBookingDate(value, today) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isRealDate = date.getFullYear() === year
    && date.getMonth() === month - 1
    && date.getDate() === day;

  return isRealDate && value >= today;
}

function listServices(req, res) {
  const ownerId = req.session.user.id;
  const today = getLocalToday();

  petModel.getPetsByOwner(ownerId, (petError, pets) => {
    if (petError) {
      console.error('Error loading pets:', petError);
      return res.status(500).send('Unable to load pets.');
    }

    serviceModel.getActiveServices((serviceError, services) => {
      if (serviceError) {
        console.error('Error loading services:', serviceError);
        return res.status(500).send('Unable to load services.');
      }

      const requestedPetId = String(req.query.petId || '');
      const selectedPetId = pets.some(pet => String(pet.id) === requestedPetId)
        ? requestedPetId
        : '';

      return res.render('services', {
        pets,
        services,
        selectedPetId,
        today,
        messages: req.flash('success'),
        errors: req.flash('error'),
        session: req.session
      });
    });
  });
}

function createBooking(req, res) {
  const { petId, serviceId, bookingDate } = req.body;
  const today = getLocalToday();

  if (!isPositiveInteger(petId)
      || !isPositiveInteger(serviceId)
      || !isValidBookingDate(bookingDate, today)) {
    req.flash('error', 'Choose a pet, service, and valid booking date.');
    return res.redirect('/services');
  }

  serviceBookingModel.createPendingBooking(
    req.session.user.id,
    Number(petId),
    Number(serviceId),
    bookingDate,
    (error, result) => {
      if (error) {
        console.error('Error creating service booking:', error);
        req.flash('error', 'Unable to create the booking. Please try again.');
        return res.redirect(`/services?petId=${petId}`);
      }

      if (!result) {
        req.flash('error', 'That pet or service is unavailable for booking.');
        return res.redirect('/services');
      }

      req.flash('success', 'Booking created. Payment is pending; no payment has been processed.');
      return res.redirect('/bookings');
    }
  );
}

function listBookings(req, res) {
  serviceBookingModel.getBookingsByOwner(req.session.user.id, (error, bookings) => {
    if (error) {
      console.error('Error loading booking history:', error);
      return res.status(500).send('Unable to load booking history.');
    }

    return res.render('bookings', {
      bookings,
      messages: req.flash('success'),
      errors: req.flash('error'),
      session: req.session
    });
  });
}

module.exports = { listServices, createBooking, listBookings };
