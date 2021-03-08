<template>
  <div class="container">

    <h2>Documentation</h2>
    <hr/>
    <div>
        <h4>Defining the DSL (Domain Specific Language)</h4>
        <p>The DSL is defined by pairs of keys and values grouped inside a <code>repeat</code> statement.</p> The <code>repeat</code> statement itself is encased in square brackets to indicate that an array of objects is to be formed.
        <p>This is important for the end user as it makes the syntax similar to other programming languages.</p>
        <p>There can also be nested <code>repeat</code> statements, as it is an easy way to allow the definition of arbitrarily-typed arrays of objects.</p>
    </div>

    <hr/>

    <div class="method">
        <div class="row margin-0 list-header hidden-sm hidden-xs">
            <div class="col-md-3"><div class="header">Property</div></div>
            <div class="col-md-2"><div class="header">Type</div></div>
            <div class="col-md-2"><div class="header">Required</div></div>
            <div class="col-md-5"><div class="header">Description</div></div>
        </div>

        <div class="row margin-0">
            <div class="col-md-3">
                <div class="cell">
                    <div class="propertyname">
                        CurrencyCode  <span class="mobile-isrequired">[Required]</span>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String</code>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="isrequired">
                        Yes
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        The standard ISO 4217 3-letter currency code
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-3">
                <div class="cell">
                    <div class="propertyname">
                        PriceType  <span class="mobile-isrequired">[Required]</span>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Int32</code>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="isrequired">
                        Yes
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        The type of price
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-3">
                <div class="cell">
                    <div class="propertyname">
                        WarehouseID  <span class="mobile-isrequired">[Required]</span>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Int32</code>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="isrequired">
                        Yes
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        The unique identifier for the warehouse
                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-3">
                <div class="cell">
                    <div class="propertyname">
                        ItemCodes
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>String[]</code>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="isrequired">
                        <span class="text-muted">No</span>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">

                    </div>
                </div>
            </div>
        </div>
        <div class="row margin-0">
            <div class="col-md-3">
                <div class="cell">
                    <div class="propertyname">
                        LanguageID
                        <a class="lookuplink" href="javascript:;">
                            <i class="glyphicon glyphicon-search"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="type">
                        <code>Int32?</code>
                    </div>
                </div>
            </div>
            <div class="col-md-2">
                <div class="cell">
                    <div class="isrequired">
                        <span class="text-muted">No</span>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div class="cell">
                    <div class="description">
                        The customer's preferred language ID (ex. 0 (English), 1 (Spanish), etc.)
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
    name: 'Documentation'
}
</script>
<style scoped>
/* Methods */
.method .header, .method .cell {
  padding: 6px 6px 6px 10px; }
.method .list-header .header {
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.8em;
  color: #999;
  background-color: #eee; }
.method [class^="row"],
.method [class*=" row"] {
  border-bottom: 1px solid #ddd; }
  .method [class^="row"]:hover,
  .method [class*=" row"]:hover {
    background-color: #f7f7f7; }
.method .cell {
  font-size: 0.85em; }
  .method .cell .mobile-isrequired {
    display: none;
    font-weight: normal;
    text-transform: uppercase;
    color: #aaa;
    font-size: 0.8em; }
  .method .cell .propertyname {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; }
  .method .cell .type {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; }
  .method .cell code {
    color: #428bca; }
  .method .cell a, .method .cell a:hover {
    text-decoration: none; }
  .method .cell code.custom {
    color: #8a6d3b;
    text-decoration: none; }
  .method .cell .text-muted {
    color: #ddd; }
@media (max-width: 991px) {
  .method [class^="row"],
  .method [class*=" row"] {
    padding-top: 10px;
    padding-bottom: 10px; }
  .method .cell {
    padding: 0 10px; }
    .method .cell .propertyname {
      font-weight: bold;
      font-size: 1.2em; }
      .method .cell .propertyname .lookuplink {
        font-weight: normal;
        font-size: 1.5em;
        position: absolute;
        top: 0;
        right: 10px; }
    .method .cell .type {
      padding-left: 10px;
      font-size: 1.1em; }
    .method .cell .isrequired {
      padding-left: 10px;
      display: none; }
    .method .cell .description {
      padding-left: 10px; }
    .method .cell .mobile-isrequired {
      display: inline; } }


/* Row Utilities */
[class^='row'].margin-0,
[class*=' row'].margin-0,
[class^='form-group'].margin-0,
[class*=' form-group'].margin-0 {
  margin-left: -0px;
  margin-right: -0px; }
  [class^='row'].margin-0 > [class^='col-'],
  [class^='row'].margin-0 > [class*=' col-'],
  [class*=' row'].margin-0 > [class^='col-'],
  [class*=' row'].margin-0 > [class*=' col-'],
  [class^='form-group'].margin-0 > [class^='col-'],
  [class^='form-group'].margin-0 > [class*=' col-'],
  [class*=' form-group'].margin-0 > [class^='col-'],
  [class*=' form-group'].margin-0 > [class*=' col-'] {
    padding-right: 0px;
    padding-left: 0px; }
  [class^='row'].margin-0 [class^='row'],
  [class^='row'].margin-0 [class*=' row'],
  [class^='row'].margin-0 [class^='form-group'],
  [class^='row'].margin-0 [class*=' form-group'],
  [class*=' row'].margin-0 [class^='row'],
  [class*=' row'].margin-0 [class*=' row'],
  [class*=' row'].margin-0 [class^='form-group'],
  [class*=' row'].margin-0 [class*=' form-group'],
  [class^='form-group'].margin-0 [class^='row'],
  [class^='form-group'].margin-0 [class*=' row'],
  [class^='form-group'].margin-0 [class^='form-group'],
  [class^='form-group'].margin-0 [class*=' form-group'],
  [class*=' form-group'].margin-0 [class^='row'],
  [class*=' form-group'].margin-0 [class*=' row'],
  [class*=' form-group'].margin-0 [class^='form-group'],
  [class*=' form-group'].margin-0 [class*=' form-group'] {
    margin-left: 0;
    margin-right: 0; }
</style>